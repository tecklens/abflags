import {TinyEmitter} from "tiny-emitter";
import {Feature, HEADER_API_KEY, IConfig, LastUpdateTerms, REFRESH_INTERVAL_INIT, SdkState, SESSION_ID} from "../types";
import EventsHandler from "./events-handler";
import {InMemoryStorageProvider, IStorageProvider, LocalStorageProvider} from "../storage";
import {computeContextHashValue, EVENTS, notNullOrUndefined, resolveAbortController, resolveFetch} from "../utils";
import {Metrics} from "./metrics";

export class AbClient extends TinyEmitter {
  private _config: IConfig;
  private eventsHandler: EventsHandler;
  private readonly url: string;
  private storage: IStorageProvider;
  private state: SdkState;
  private metrics: Metrics;
  private readyEventEmitted = false;
  private readonly storeKey = 'feature';
  private readonly lastUpdateKey = 'last-time';
  private lastRefreshTimestamp: number;
  private features?: Feature[];
  private readonly fetch: any;
  private eTag = '';
  private abortController?: AbortController | null;
  private lastError: any;
  private fetchedFromServer = false;
  private readonly ready: Promise<void>;
  private started = false;
  private timerRef?: any;

  constructor(config: IConfig) {
    super();

    if (!config.clientKey) {
      throw new Error('clientKey is required');
    }
    if (!config.appName) {
      throw new Error('appName is required.');
    }

    this.eventsHandler = new EventsHandler();

    this.url = config.url ?? 'https://ab.wolfx.app';

    // * init storage
    this.storage =
      config.storageProvider ||
      (typeof window !== 'undefined'
        ? new LocalStorageProvider()
        : new InMemoryStorageProvider());
    if (!fetch) {
      this.fetch = resolveFetch()
      console.debug(
        'You must either provide your own "fetch" implementation or run in an environment where "fetch" is available.'
      );
    } else this.fetch = fetch;

    this.ready = new Promise((resolve) => {
      this.init()
        .then(resolve)
        .catch((error) => {
          console.debug(error);
          this.state = 'error';
          this.emit(EVENTS.ERROR, error);
          this.lastError = error;
          resolve();
        });
    });
    this.features = [];
    this.lastRefreshTimestamp = 0;
    this.state = 'initializing';
    this._config = config;

    this.metrics = new Metrics({
      onError: this.emit.bind(this, EVENTS.ERROR),
      onSent: this.emit.bind(this, EVENTS.SENT),
      appName: this._config.appName,
      metricsInterval: this._config.metricsInterval ?? 10,
      disableMetrics: this._config.disableMetrics ?? false,
      url: this.url,
      clientKey: this._config.clientKey,
      fetch,
      customHeaders: this._config.customHeaders,
      metricsIntervalInitial: this._config.metricsIntervalInitial ?? 10,
    });
  }

  private async init(): Promise<void> {
    this._config.sessionId = await this.resolveSessionId();

    this.features = (await this.storage.get(this.storeKey)) || [];
    this.lastRefreshTimestamp = await this.getLastRefreshTimestamp();

    this.state = 'healthy';
    this.emit(EVENTS.INIT);
  }

  public async start(): Promise<void> {
    this.started = true;
    if (this.timerRef) {
      console.error(
        'SDK has already started, if you want to restart the SDK you should call client.stop() before starting again.'
      );
      return;
    }
    await this.ready;
    this.metrics.start();
    const interval = this._config.refreshInterval ?? REFRESH_INTERVAL_INIT;

    await this.initialFetchToggles();

    if (interval > 0) {
      this.timerRef = setInterval(() => this.fetchFeatures(), interval);
    }
  }

  private async getLastRefreshTimestamp(): Promise<number> {
    const lastRefresh: LastUpdateTerms | undefined =
      await this.storage.get(this.lastUpdateKey);
    const contextHash = await computeContextHashValue({
      appName: this._config.appName,
      sessionId: this._config.sessionId,
      currentTime: this._config.currentTime,
      userId: this._config.userId,
      environment: this._config.environment,
      properties: this._config.properties,
    });
    return lastRefresh?.key === contextHash ? lastRefresh.timestamp : 0;
  }

  private setReady() {
    this.readyEventEmitted = true;
    this.emit(EVENTS.READY);
  }

  private async storeLastRefreshTimestamp(): Promise<void> {
    this.lastRefreshTimestamp = Date.now();

    const contextHash = await computeContextHashValue({
      appName: this._config.appName,
      sessionId: this._config.sessionId,
      currentTime: this._config.currentTime,
      userId: this._config.userId,
      environment: this._config.environment,
      properties: this._config.properties,
    });
    const lastUpdateValue: LastUpdateTerms = {
      key: contextHash,
      timestamp: this.lastRefreshTimestamp,
    };
    await this.storage.save(this.lastUpdateKey, lastUpdateValue);
  }

  private async resolveSessionId(): Promise<string> {
    let sessionId = await this.storage.get(SESSION_ID);
    if (!sessionId) {
      sessionId = Math.floor(Math.random() * 1_000_000_000);
      await this.storage.save(SESSION_ID, sessionId.toString(10));
    }
    return sessionId.toString(10);
  }

  private isUpToDate(): boolean {
    const now = Date.now();

    const ttl = this._config.refreshInterval || REFRESH_INTERVAL_INIT;

    return (
      this.lastRefreshTimestamp > 0 &&
      this.lastRefreshTimestamp <= now &&
      now - this.lastRefreshTimestamp <= ttl
    );
  }
  private initialFetchToggles() {
    if (this.isUpToDate()) {
      if (!this.fetchedFromServer) {
        this.fetchedFromServer = true;
        this.setReady();
      }
      return;
    }
    return this.fetchFeatures();
  }

  private async fetchFeatures() {
    if (this.fetch) {
      if (this.abortController) {
        this.abortController.abort();
      }
      this.abortController = resolveAbortController();
      const signal = this.abortController
        ? this.abortController.signal
        : undefined;
      try {
        const url = this.url;
        const method = 'POST';
        const body = JSON.stringify({
          appName: this._config.appName,
          environment: this._config.environment,
          userId: this._config.userId,
          sessionId: this._config.sessionId,
          currentTime: this._config.currentTime,
          properties: this._config.properties
        })

        const response = await this.fetch(url.toString(), {
          method,
          cache: 'no-cache',
          headers: this.getHeaders(),
          body,
          signal,
        });
        if (this.state === 'error' && response.status < 400) {
          this.state = 'healthy';
          this.emit(EVENTS.RECOVERED);
        }

        if (response.ok) {
          this.eTag = response.headers.get('ETag') || '';
          const data = await response.json();
          await this.storeToggles(data.toggles);

          if (this.state !== 'healthy') {
            this.state = 'healthy';
          }
          if (!this.fetchedFromServer) {
            this.fetchedFromServer = true;
            this.setReady();
          }
          this.storeLastRefreshTimestamp();
        } else if (response.status === 304) {
          this.storeLastRefreshTimestamp();
        } else {
          console.error(
            'Unleash: Fetching feature toggles did not have an ok response'
          );
          this.state = 'error';
          this.emit(EVENTS.ERROR, {
            type: 'HttpError',
            code: response.status,
          });

          this.lastError = {
            type: 'HttpError',
            code: response.status,
          };
        }
      } catch (e) {
        if (
          !(
            typeof e === 'object' &&
            e !== null &&
            'name' in e &&
            e.name === 'AbortError'
          )
        ) {
          console.error(
            'Unleash: unable to fetch feature toggles',
            e
          );
          this.state = 'error';
          this.emit(EVENTS.ERROR, e);
          this.lastError = e;
        }
      } finally {
        this.abortController = null;
      }
    }
  }

  private async storeToggles(features: Feature[]): Promise<void> {
    this.features = features;
    this.emit(EVENTS.UPDATE);
    await this.storage.save(this.storeKey, features);
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      [HEADER_API_KEY]: this._config.clientKey,
      Accept: 'application/json',
    };
      headers['Content-Type'] = 'application/json';
    if (this.eTag) {
      headers['If-None-Match'] = this.eTag;
    }
    Object.entries(this._config.customHeaders ?? {})
      .filter(notNullOrUndefined)
      .forEach(([name, value]) => (headers[name] = value));
    return headers;
  }
}
