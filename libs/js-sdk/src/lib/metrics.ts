import {notNullOrUndefined} from "../utils";
import {HEADER_API_KEY} from "../types";

export interface MetricsOptions {
  onError: OnError;
  onSent?: OnSent;
  appName: string;
  metricsInterval: number;
  disableMetrics?: boolean;
  url: URL | string;
  clientKey: string;
  fetch: any;
  customHeaders?: Record<string, string>;
  metricsIntervalInitial: number;
}

interface VariantBucket {
  [s: string]: number;
}

interface Bucket {
  start: Date;
  stop: Date | null;
  toggles: {
    [s: string]: { yes: number; no: number; variants: VariantBucket };
  };
}

interface Payload {
  bucket: Bucket;
  appName: string;
  instanceId: string;
}

type OnError = (error: unknown) => void;
type OnSent = (payload: Payload) => void;
// eslint-disable-next-line @typescript-eslint/no-empty-function
const doNothing = () => {};

export class Metrics {
  private readonly onError: OnError;
  private readonly onSent: OnSent;
  private bucket: Bucket;
  private readonly appName: string;
  private readonly metricsInterval: number;
  private readonly disabled: boolean;
  private readonly url: URL;
  private readonly clientKey: string;
  private timer: any;
  private readonly fetch: any;
  private customHeaders: Record<string, string>;
  private readonly metricsIntervalInitial: number;

  constructor({
                onError,
                onSent,
                appName,
                metricsInterval,
                disableMetrics = false,
                url,
                clientKey,
                fetch,
                customHeaders = {},
                metricsIntervalInitial,
              }: MetricsOptions) {
    this.onError = onError;
    this.onSent = onSent || doNothing;
    this.disabled = disableMetrics;
    this.metricsInterval = metricsInterval * 1000;
    this.metricsIntervalInitial = metricsIntervalInitial * 1000;
    this.appName = appName;
    this.url = url instanceof URL ? url : new URL(url);
    this.clientKey = clientKey;
    this.bucket = this.createEmptyBucket();
    this.fetch = fetch;
    this.customHeaders = customHeaders;
  }

  public start() {
    if (this.disabled) {
      return false;
    }

    if (
      typeof this.metricsInterval === 'number' &&
      this.metricsInterval > 0
    ) {
      if (this.metricsIntervalInitial > 0) {
        setTimeout(async () => {
          this.startTimer();
          await this.sendMetrics();
        }, this.metricsIntervalInitial);
      } else {
        this.startTimer();
      }
    }
  }

  public stop() {
    if (this.timer) {
      clearTimeout(this.timer);
      delete this.timer;
    }
  }

  public createEmptyBucket(): Bucket {
    return {
      start: new Date(),
      stop: null,
      toggles: {},
    };
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      [HEADER_API_KEY]: this.clientKey,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    Object.entries(this.customHeaders)
      .filter(notNullOrUndefined)
      .forEach(([name, value]) => (headers[name] = value));

    return headers;
  }

  public async sendMetrics(): Promise<void> {
    /* istanbul ignore next if */

    const url = `${this.url}/client/metrics`;
    const payload = this.getPayload();

    if (this.bucketIsEmpty(payload)) {
      return;
    }

    try {
      await this.fetch(url, {
        cache: 'no-cache',
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });
      this.onSent(payload);
    } catch (e) {
      console.error('Unleash: unable to send feature metrics', e);
      this.onError(e);
    }
  }

  public count(name: string, enabled: boolean): boolean {
    if (this.disabled || !this.bucket) {
      return false;
    }
    this.assertBucket(name);
    this.bucket.toggles[name][enabled ? 'yes' : 'no']++;
    return true;
  }

  public countVariant(name: string, variant: string): boolean {
    if (this.disabled || !this.bucket) {
      return false;
    }
    this.assertBucket(name);
    if (this.bucket.toggles[name].variants[variant]) {
      this.bucket.toggles[name].variants[variant] += 1;
    } else {
      this.bucket.toggles[name].variants[variant] = 1;
    }
    return true;
  }

  private assertBucket(name: string) {
    if (this.disabled || !this.bucket) {
      return false;
    }
    if (!this.bucket.toggles[name]) {
      this.bucket.toggles[name] = {
        yes: 0,
        no: 0,
        variants: {},
      };
    }
  }

  private startTimer(): void {
    this.timer = setInterval(async () => {
      await this.sendMetrics();
    }, this.metricsInterval);
  }

  private bucketIsEmpty(payload: Payload) {
    return Object.keys(payload.bucket.toggles).length === 0;
  }

  private getPayload(): Payload {
    const bucket = { ...this.bucket, stop: new Date() };
    this.bucket = this.createEmptyBucket();

    return {
      bucket,
      appName: this.appName,
      instanceId: 'browser',
    };
  }
}
