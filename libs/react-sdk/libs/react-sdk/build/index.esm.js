import { jsx as u, Fragment as st } from "react/jsx-runtime";
import it, { createContext as rt, useEffect as nt, useMemo as ot, useContext as at } from "react";
function Ct() {
  return /* @__PURE__ */ u("div", { children: /* @__PURE__ */ u("h1", { children: "Welcome to ReactSdk!" }) });
}
var q = { exports: {} };
function f() {
}
f.prototype = {
  on: function(s, t, e) {
    var i = this.e || (this.e = {});
    return (i[s] || (i[s] = [])).push({
      fn: t,
      ctx: e
    }), this;
  },
  once: function(s, t, e) {
    var i = this;
    function r() {
      i.off(s, r), t.apply(e, arguments);
    }
    return r._ = t, this.on(s, r, e);
  },
  emit: function(s) {
    var t = [].slice.call(arguments, 1), e = ((this.e || (this.e = {}))[s] || []).slice(), i = 0, r = e.length;
    for (i; i < r; i++)
      e[i].fn.apply(e[i].ctx, t);
    return this;
  },
  off: function(s, t) {
    var e = this.e || (this.e = {}), i = e[s], r = [];
    if (i && t)
      for (var n = 0, a = i.length; n < a; n++)
        i[n].fn !== t && i[n].fn._ !== t && r.push(i[n]);
    return r.length ? e[s] = r : delete e[s], this;
  }
};
q.exports = f;
var ht = q.exports.TinyEmitter = f;
const z = "api_key", m = "session_id", p = 30;
let d;
const ct = new Uint8Array(16);
function lt() {
  if (!d && (d = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !d))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return d(ct);
}
const o = [];
for (let s = 0; s < 256; ++s)
  o.push((s + 256).toString(16).slice(1));
function dt(s, t = 0) {
  return o[s[t + 0]] + o[s[t + 1]] + o[s[t + 2]] + o[s[t + 3]] + "-" + o[s[t + 4]] + o[s[t + 5]] + "-" + o[s[t + 6]] + o[s[t + 7]] + "-" + o[s[t + 8]] + o[s[t + 9]] + "-" + o[s[t + 10]] + o[s[t + 11]] + o[s[t + 12]] + o[s[t + 13]] + o[s[t + 14]] + o[s[t + 15]];
}
const ut = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), g = {
  randomUUID: ut
};
function ft(s, t, e) {
  if (g.randomUUID && !t && !s)
    return g.randomUUID();
  s = s || {};
  const i = s.random || (s.rng || lt)();
  return i[6] = i[6] & 15 | 64, i[8] = i[8] & 63 | 128, dt(i);
}
class mt {
  generateEventId() {
    return ft();
  }
  createImpressionEvent(t, e, i, r, n, a) {
    const l = this.createBaseEvent(
      t,
      e,
      i,
      r,
      n
    );
    return a ? {
      ...l,
      variant: a
    } : l;
  }
  createBaseEvent(t, e, i, r, n) {
    return {
      eventType: r,
      eventId: this.generateEventId(),
      context: t,
      enabled: e,
      featureName: i,
      impressionData: n
    };
  }
}
class pt {
  constructor(t = "ab:cache") {
    this.prefix = t;
  }
  async save(t, e) {
    const i = JSON.stringify(e), r = `${this.prefix}:${t}`;
    try {
      window.localStorage.setItem(r, i);
    } catch (n) {
      console.error(n);
    }
  }
  get(t) {
    try {
      const e = `${this.prefix}:${t}`, i = window.localStorage.getItem(e);
      return i ? JSON.parse(i) : void 0;
    } catch (e) {
      console.error(e);
    }
  }
}
class gt {
  constructor() {
    this.store = /* @__PURE__ */ new Map();
  }
  async save(t, e) {
    this.store.set(t, e);
  }
  async get(t) {
    return this.store.get(t);
  }
}
var y;
const vt = ((y = globalThis.window) == null ? void 0 : y.document) !== void 0;
var b, w;
const yt = ((w = (b = globalThis.process) == null ? void 0 : b.versions) == null ? void 0 : w.node) !== void 0;
var I, T;
(T = (I = globalThis.process) == null ? void 0 : I.versions) == null || T.bun;
var E, S;
(S = (E = globalThis.Deno) == null ? void 0 : E.version) == null || S.deno;
var R, _;
(_ = (R = globalThis.process) == null ? void 0 : R.versions) == null || _.electron;
var A, x;
(x = (A = globalThis.navigator) == null ? void 0 : A.userAgent) == null || x.includes("jsdom");
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
typeof DedicatedWorkerGlobalScope < "u" && globalThis instanceof DedicatedWorkerGlobalScope;
typeof SharedWorkerGlobalScope < "u" && globalThis instanceof SharedWorkerGlobalScope;
typeof ServiceWorkerGlobalScope < "u" && globalThis instanceof ServiceWorkerGlobalScope;
var k, N;
const c = (N = (k = globalThis.navigator) == null ? void 0 : k.userAgentData) == null ? void 0 : N.platform;
var U, D, C, P;
const bt = c === "macOS" || ((U = globalThis.navigator) == null ? void 0 : U.platform) === "MacIntel" || ((C = (D = globalThis.navigator) == null ? void 0 : D.userAgent) == null ? void 0 : C.includes(" Mac ")) === !0 || ((P = globalThis.process) == null ? void 0 : P.platform) === "darwin";
var H, O;
const wt = c === "Windows" || ((H = globalThis.navigator) == null ? void 0 : H.platform) === "Win32" || ((O = globalThis.process) == null ? void 0 : O.platform) === "win32";
var F, M, K, j, L;
const It = c === "Linux" || ((M = (F = globalThis.navigator) == null ? void 0 : F.platform) == null ? void 0 : M.startsWith("Linux")) === !0 || ((j = (K = globalThis.navigator) == null ? void 0 : K.userAgent) == null ? void 0 : j.includes(" Linux ")) === !0 || ((L = globalThis.process) == null ? void 0 : L.platform) === "linux";
var W, V, B;
const Tt = c === "iOS" || ((W = globalThis.navigator) == null ? void 0 : W.platform) === "MacIntel" && ((V = globalThis.navigator) == null ? void 0 : V.maxTouchPoints) > 1 || /iPad|iPhone|iPod/.test((B = globalThis.navigator) == null ? void 0 : B.platform);
var G, $, J, Y;
c === "Android" || ((G = globalThis.navigator) == null ? void 0 : G.platform) === "Android" || ((J = ($ = globalThis.navigator) == null ? void 0 : $.userAgent) == null ? void 0 : J.includes(" Android ")) === !0 || ((Y = globalThis.process) == null || Y.platform);
const h = {
  INIT: "initialized",
  ERROR: "error",
  READY: "ready",
  UPDATE: "update",
  IMPRESSION: "impression",
  SENT: "sent",
  RECOVERED: "recovered"
}, Q = ([, s]) => s != null, Et = (s) => JSON.stringify(s), St = async (s) => {
  var r, n;
  const t = typeof globalThis < "u" && ((r = globalThis.crypto) != null && r.subtle) ? (n = globalThis.crypto) == null ? void 0 : n.subtle : void 0;
  if (typeof TextEncoder > "u" || !(t != null && t.digest) || typeof Uint8Array > "u")
    throw new Error("Hashing function not available");
  const e = new TextEncoder().encode(s), i = await t.digest("SHA-256", e);
  return Array.from(new Uint8Array(i)).map((a) => a.toString(16).padStart(2, "0")).join("");
}, v = async (s) => {
  const t = Et(s);
  try {
    return await St(t);
  } catch {
    return t;
  }
}, Rt = () => {
  try {
    if (typeof window < "u" && "fetch" in window)
      return fetch.bind(window);
    if ("fetch" in globalThis)
      return fetch.bind(globalThis);
  } catch (s) {
    console.error('Unleash failed to resolve "fetch"', s);
  }
}, _t = () => {
  try {
    if (typeof window < "u" && "AbortController" in window)
      return new window.AbortController();
    if ("fetch" in globalThis)
      return new globalThis.AbortController();
  } catch (s) {
    console.error('Unleash failed to resolve "AbortController" factory', s);
  }
}, At = () => ({
  os: bt ? "mac-os" : wt ? "window" : It ? "linux" : Tt ? "ios" : "android",
  environment: vt ? "browser" : yt ? "backend" : "web-worker"
}), xt = () => {
};
class kt {
  constructor({
    onError: t,
    onSent: e,
    appName: i,
    metricsInterval: r,
    disableMetrics: n = !1,
    url: a,
    clientKey: l,
    fetch: Z,
    customHeaders: tt = {},
    metricsIntervalInitial: et
  }) {
    this.onError = t, this.onSent = e || xt, this.disabled = n, this.metricsInterval = r ?? 1e3, this.metricsIntervalInitial = et ?? 1e3, this.appName = i, this.url = a instanceof URL ? a : new URL(a), this.clientKey = l, this.bucket = this.createEmptyBucket(), this.fetch = Z, this.customHeaders = tt, this.environment = At();
  }
  start() {
    if (this.disabled)
      return !1;
    typeof this.metricsInterval == "number" && this.metricsInterval > 0 && (this.metricsIntervalInitial && this.metricsIntervalInitial > 0 ? setTimeout(async () => {
      this.startTimer(), await this.sendMetrics();
    }, this.metricsIntervalInitial) : this.startTimer());
  }
  stop() {
    this.timer && (clearTimeout(this.timer), delete this.timer);
  }
  createEmptyBucket() {
    return {
      start: /* @__PURE__ */ new Date(),
      stop: null,
      features: {}
    };
  }
  getHeaders() {
    const t = {
      [z]: this.clientKey,
      Accept: "application/json",
      "Content-Type": "application/json"
    };
    return Object.entries(this.customHeaders).filter(Q).forEach(([e, i]) => t[e] = i), t;
  }
  async sendMetrics() {
    const t = `${this.url}ab/v1/metric`, e = this.getPayload();
    if (!this.bucketIsEmpty(e))
      try {
        await this.fetch(t, {
          cache: "no-cache",
          method: "POST",
          headers: this.getHeaders(),
          body: JSON.stringify(e)
        }), this.onSent(e);
      } catch (i) {
        console.error("AbFlags: unable to send feature metrics", i), this.onError(i);
      }
  }
  count(t, e) {
    return this.disabled || !this.bucket ? !1 : (this.assertBucket(t), this.bucket.features[t][e ? "yes" : "no"]++, !0);
  }
  assertBucket(t) {
    if (this.disabled || !this.bucket)
      return !1;
    this.bucket.features[t] || (this.bucket.features[t] = {
      yes: 0,
      no: 0
    });
  }
  startTimer() {
    this.timer = setInterval(async () => {
      await this.sendMetrics();
    }, this.metricsInterval);
  }
  bucketIsEmpty(t) {
    return Object.keys(t.bucket.features).length === 0;
  }
  getPayload() {
    const t = { ...this.bucket, stop: /* @__PURE__ */ new Date() };
    return this.bucket = this.createEmptyBucket(), {
      bucket: t,
      createdAt: /* @__PURE__ */ new Date(),
      appName: this.appName,
      instanceId: "browser",
      os: this.environment.os,
      environment: this.environment.environment
    };
  }
}
class Nt extends ht {
  constructor(t) {
    if (super(), this.readyEventEmitted = !1, this.storeKey = "feature", this.lastUpdateKey = "last-time", this.etag = "", this.fetchedFromServer = !1, this.started = !1, !t.clientKey)
      throw new Error("clientKey is required");
    if (!t.appName)
      throw new Error("appName is required.");
    this.eventsHandler = new mt(), this.url = t.url ?? "https://ab.wolfx.app", this.storage = t.storageProvider || (typeof window < "u" ? new pt() : new gt()), this.fetch = Rt(), this.fetch || console.error(
      'You must either provide your own "fetch" implementation or run in an environment where "fetch" is available.'
    ), this._config = t, this.ready = new Promise((e) => {
      this.init().then(e).catch((i) => {
        console.debug(i), this.state = "error", this.emit(h.ERROR, i), this.lastError = i, e();
      });
    }), this.features = [], this.lastRefreshTimestamp = 0, this.state = "initializing", this.metrics = new kt({
      onError: this.emit.bind(this, h.ERROR),
      onSent: this.emit.bind(this, h.SENT),
      appName: this._config.appName,
      metricsInterval: this._config.metricsInterval,
      disableMetrics: this._config.disableMetrics ?? !1,
      url: this.url,
      clientKey: this._config.clientKey,
      fetch: this.fetch,
      customHeaders: this._config.customHeaders,
      metricsIntervalInitial: this._config.metricsIntervalInitial ?? 1e3
    });
  }
  async init() {
    this._config.sessionId = await this.resolveSessionId(), this.features = await this.storage.get(this.storeKey) || [], this.lastRefreshTimestamp = await this.getLastRefreshTimestamp(), this.state = "healthy", this.emit(h.INIT);
  }
  async start() {
    if (this.started = !0, this.timerRef) {
      console.error(
        "SDK has already started, if you want to restart the SDK you should call client.stop() before starting again."
      );
      return;
    }
    await this.ready, this.metrics.start();
    const t = this._config.refreshInterval && this._config.refreshInterval > 500 ? this._config.refreshInterval : p;
    await this.initialFetchFeatures(), t > 0 && (this.timerRef = setInterval(() => this.fetchFeatures(), t));
  }
  async getLastRefreshTimestamp() {
    const t = await this.storage.get(this.lastUpdateKey), e = await v({
      appName: this._config.appName,
      sessionId: this._config.sessionId,
      currentTime: this._config.currentTime,
      userId: this._config.userId,
      environment: this._config.environment,
      properties: this._config.properties
    });
    return (t == null ? void 0 : t.key) === e ? t.timestamp : 0;
  }
  setReady() {
    this.readyEventEmitted = !0, this.emit(h.READY);
  }
  async storeLastRefreshTimestamp() {
    this.lastRefreshTimestamp = Date.now();
    const e = {
      key: await v({
        appName: this._config.appName,
        sessionId: this._config.sessionId,
        currentTime: this._config.currentTime,
        userId: this._config.userId,
        environment: this._config.environment,
        properties: this._config.properties
      }),
      timestamp: this.lastRefreshTimestamp
    };
    await this.storage.save(this.lastUpdateKey, e);
  }
  async resolveSessionId() {
    let t = await this.storage.get(m);
    return t || (t = Math.floor(Math.random() * 1e9), await this.storage.save(m, t.toString(10))), t.toString(10);
  }
  isUpToDate() {
    const t = Date.now(), e = this._config.refreshInterval && this._config.refreshInterval > 500 ? this._config.refreshInterval : p;
    return this.lastRefreshTimestamp > 0 && this.lastRefreshTimestamp <= t && t - this.lastRefreshTimestamp <= e;
  }
  initialFetchFeatures() {
    if (this.isUpToDate()) {
      this.fetchedFromServer || (this.fetchedFromServer = !0, this.setReady());
      return;
    }
    return this.fetchFeatures();
  }
  async fetchFeatures() {
    if (this.fetch) {
      this.abortController && this.abortController.abort(), this.abortController = _t();
      const t = this.abortController ? this.abortController.signal : void 0;
      try {
        const e = new URL("/ab/v1/feature/frontend", this.url), i = "GET";
        e.searchParams.set("appName", this._config.appName), e.searchParams.set("environment", this._config.environment ?? ""), e.searchParams.set("userId", this._config.userId ?? ""), e.searchParams.set("sessionId", this._config.sessionId ?? ""), e.searchParams.set("currentTime", this._config.currentTime ?? (/* @__PURE__ */ new Date()).toString());
        for (let n of Object.entries(this._config.properties ?? {}))
          e.searchParams.set(n[0], n[1]);
        const r = await this.fetch(e.toString(), {
          method: i,
          cache: "no-cache",
          headers: this.getHeaders(),
          signal: t
        });
        if (this.state === "error" && r.status < 400 && (this.state = "healthy", this.emit(h.RECOVERED)), r.ok) {
          this.etag = r.headers.get("ETag") || "";
          const n = await r.json();
          await this.storeFeatures(n), this.state !== "healthy" && (this.state = "healthy"), this.fetchedFromServer || (this.fetchedFromServer = !0, this.setReady()), this.storeLastRefreshTimestamp();
        } else r.status === 304 ? this.storeLastRefreshTimestamp() : (console.error(
          "AbFlags: Fetching feature toggles did not have an ok response"
        ), this.state = "error", this.emit(h.ERROR, {
          type: "HttpError",
          code: r.status
        }), this.lastError = {
          type: "HttpError",
          code: r.status
        });
      } catch (e) {
        typeof e == "object" && e !== null && "name" in e && e.name === "AbortError" || (console.error(
          "AbFlags: unable to fetch feature toggles",
          e
        ), this.state = "error", this.emit(h.ERROR, e), this.lastError = e);
      } finally {
        this.abortController = null;
      }
    }
  }
  async storeFeatures(t) {
    this.features = t, this.emit(h.UPDATE), await this.storage.save(this.storeKey, t);
  }
  getHeaders() {
    const t = {
      [z]: this._config.clientKey,
      Accept: "application/json"
    };
    return t["Content-Type"] = "application/json", this.etag && (t["If-None-Match"] = this.etag), Object.entries(this._config.customHeaders ?? {}).filter(Q).forEach(([e, i]) => t[e] = i), t;
  }
  isEnabled(t) {
    var i;
    const e = !!((i = this.features) != null && i.find((r) => r.name === t));
    return this.metrics.count(t, e), e;
  }
}
const X = rt(void 0), Pt = ({ children: s, config: t }) => {
  const [e, i] = it.useState();
  nt(() => {
    i(new Nt({
      url: t.url,
      clientKey: t.clientKey,
      appName: t.appName,
      userId: t.userId,
      disableMetrics: t.disableMetrics,
      metricsInterval: t.metricsInterval,
      refreshInterval: t.refreshInterval
    }));
  }, [t]);
  const r = ot(
    () => ({
      ...t,
      client: e
    }),
    [t, e]
  );
  return /* @__PURE__ */ u(st, { children: /* @__PURE__ */ u(X.Provider, { value: r, children: s }) });
}, Ht = () => at(X);
export {
  Ct as AbClient,
  Pt as AbProvider,
  Ht as useAbflags
};
//# sourceMappingURL=index.esm.js.map
