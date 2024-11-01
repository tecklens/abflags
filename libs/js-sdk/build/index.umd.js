(function(c,l){typeof exports=="object"&&typeof module<"u"?l(exports):typeof define=="function"&&define.amd?define(["exports"],l):(c=typeof globalThis<"u"?globalThis:c||self,l(c.ab={}))})(this,function(c){"use strict";var l={exports:{}};function d(){}d.prototype={on:function(s,t,e){var i=this.e||(this.e={});return(i[s]||(i[s]=[])).push({fn:t,ctx:e}),this},once:function(s,t,e){var i=this;function r(){i.off(s,r),t.apply(e,arguments)}return r._=t,this.on(s,r,e)},emit:function(s){var t=[].slice.call(arguments,1),e=((this.e||(this.e={}))[s]||[]).slice(),i=0,r=e.length;for(i;i<r;i++)e[i].fn.apply(e[i].ctx,t);return this},off:function(s,t){var e=this.e||(this.e={}),i=e[s],r=[];if(i&&t)for(var n=0,o=i.length;n<o;n++)i[n].fn!==t&&i[n].fn._!==t&&r.push(i[n]);return r.length?e[s]=r:delete e[s],this}},l.exports=d;var w=l.exports.TinyEmitter=d;const m="api_key",p="session_id",g=2e3;let u;const I=new Uint8Array(16);function E(){if(!u&&(u=typeof crypto<"u"&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!u))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return u(I)}const a=[];for(let s=0;s<256;++s)a.push((s+256).toString(16).slice(1));function T(s,t=0){return a[s[t+0]]+a[s[t+1]]+a[s[t+2]]+a[s[t+3]]+"-"+a[s[t+4]]+a[s[t+5]]+"-"+a[s[t+6]]+a[s[t+7]]+"-"+a[s[t+8]]+a[s[t+9]]+"-"+a[s[t+10]]+a[s[t+11]]+a[s[t+12]]+a[s[t+13]]+a[s[t+14]]+a[s[t+15]]}const y={randomUUID:typeof crypto<"u"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};function R(s,t,e){if(y.randomUUID&&!t&&!s)return y.randomUUID();s=s||{};const i=s.random||(s.rng||E)();return i[6]=i[6]&15|64,i[8]=i[8]&63|128,T(i)}class _{generateEventId(){return R()}createImpressionEvent(t,e,i,r,n,o){const f=this.createBaseEvent(t,e,i,r,n);return o?{...f,variant:o}:f}createBaseEvent(t,e,i,r,n){return{eventType:r,eventId:this.generateEventId(),context:t,enabled:e,featureName:i,impressionData:n}}}class S{constructor(t="ab:cache"){this.prefix=t}async save(t,e){const i=JSON.stringify(e),r=`${this.prefix}:${t}`;try{window.localStorage.setItem(r,i)}catch(n){console.error(n)}}get(t){try{const e=`${this.prefix}:${t}`,i=window.localStorage.getItem(e);return i?JSON.parse(i):void 0}catch(e){console.error(e)}}}class U{constructor(){this.store=new Map}async save(t,e){this.store.set(t,e)}async get(t){return this.store.get(t)}}const h={INIT:"initialized",ERROR:"error",READY:"ready",UPDATE:"update",IMPRESSION:"impression",SENT:"sent",RECOVERED:"recovered"},v=([,s])=>s!=null,N=s=>JSON.stringify(s),A=async s=>{var r,n;const t=typeof globalThis<"u"&&((r=globalThis.crypto)!=null&&r.subtle)?(n=globalThis.crypto)==null?void 0:n.subtle:void 0;if(typeof TextEncoder>"u"||!(t!=null&&t.digest)||typeof Uint8Array>"u")throw new Error("Hashing function not available");const e=new TextEncoder().encode(s),i=await t.digest("SHA-256",e);return Array.from(new Uint8Array(i)).map(o=>o.toString(16).padStart(2,"0")).join("")},b=async s=>{const t=N(s);try{return await A(t)}catch{return t}},x=()=>{try{if(typeof window<"u"&&"fetch"in window)return window.fetch.bind(window);if("fetch"in globalThis)return globalThis.fetch.bind(globalThis)}catch(s){console.error('Unleash failed to resolve "fetch"',s)}},D=()=>{try{if(typeof window<"u"&&"AbortController"in window)return new window.AbortController;if("fetch"in globalThis)return new globalThis.AbortController}catch(s){console.error('Unleash failed to resolve "AbortController" factory',s)}},H=()=>{};class k{constructor({onError:t,onSent:e,appName:i,metricsInterval:r,disableMetrics:n=!1,url:o,clientKey:f,fetch:O,customHeaders:C={},metricsIntervalInitial:P}){this.onError=t,this.onSent=e||H,this.disabled=n,this.metricsInterval=r??1e3,this.metricsIntervalInitial=P??1e3,this.appName=i,this.url=o instanceof URL?o:new URL(o),this.clientKey=f,this.bucket=this.createEmptyBucket(),this.fetch=O,this.customHeaders=C}start(){if(this.disabled)return!1;typeof this.metricsInterval=="number"&&this.metricsInterval>0&&(this.metricsIntervalInitial&&this.metricsIntervalInitial>0?setTimeout(async()=>{this.startTimer(),await this.sendMetrics()},this.metricsIntervalInitial):this.startTimer())}stop(){this.timer&&(clearTimeout(this.timer),delete this.timer)}createEmptyBucket(){return{start:new Date,stop:null,features:{}}}getHeaders(){const t={[m]:this.clientKey,Accept:"application/json","Content-Type":"application/json"};return Object.entries(this.customHeaders).filter(v).forEach(([e,i])=>t[e]=i),t}async sendMetrics(){const t=`${this.url}ab/v1/metric`,e=this.getPayload();if(!this.bucketIsEmpty(e))try{await this.fetch(t,{cache:"no-cache",method:"POST",headers:this.getHeaders(),body:JSON.stringify(e)}),this.onSent(e)}catch(i){console.error("AbFlags: unable to send feature metrics",i),this.onError(i)}}count(t,e){return this.disabled||!this.bucket?!1:(this.assertBucket(t),this.bucket.features[t][e?"yes":"no"]++,!0)}assertBucket(t){if(this.disabled||!this.bucket)return!1;this.bucket.features[t]||(this.bucket.features[t]={yes:0,no:0})}startTimer(){this.timer=setInterval(async()=>{await this.sendMetrics()},this.metricsInterval)}bucketIsEmpty(t){return Object.keys(t.bucket.features).length===0}getPayload(){const t={...this.bucket,stop:new Date};return console.debug(`send metric ${t}`),this.bucket=this.createEmptyBucket(),{bucket:t,createdAt:new Date,appName:this.appName,instanceId:"browser"}}}class F extends w{constructor(t){if(super(),this.readyEventEmitted=!1,this.storeKey="feature",this.lastUpdateKey="last-time",this.etag="",this.fetchedFromServer=!1,this.started=!1,!t.clientKey)throw new Error("clientKey is required");if(!t.appName)throw new Error("appName is required.");this.eventsHandler=new _,this.url=t.url??"https://ab.wolfx.app",this.storage=t.storageProvider||(typeof window<"u"?new S:new U),this.fetch=x(),this.fetch||console.error('You must either provide your own "fetch" implementation or run in an environment where "fetch" is available.'),this._config=t,this.ready=new Promise(e=>{this.init().then(e).catch(i=>{console.debug(i),this.state="error",this.emit(h.ERROR,i),this.lastError=i,e()})}),this.features=[],this.lastRefreshTimestamp=0,this.state="initializing",this.metrics=new k({onError:this.emit.bind(this,h.ERROR),onSent:this.emit.bind(this,h.SENT),appName:this._config.appName,metricsInterval:this._config.metricsInterval,disableMetrics:this._config.disableMetrics??!1,url:this.url,clientKey:this._config.clientKey,fetch:this.fetch,customHeaders:this._config.customHeaders,metricsIntervalInitial:this._config.metricsIntervalInitial??10})}async init(){this._config.sessionId=await this.resolveSessionId(),this.features=await this.storage.get(this.storeKey)||[],this.lastRefreshTimestamp=await this.getLastRefreshTimestamp(),this.state="healthy",this.emit(h.INIT)}async start(){if(this.started=!0,this.timerRef){console.error("SDK has already started, if you want to restart the SDK you should call client.stop() before starting again.");return}await this.ready,this.metrics.start();const t=this._config.refreshInterval&&this._config.refreshInterval>500?this._config.refreshInterval:g;await this.initialFetchFeatures(),t>0&&(this.timerRef=setInterval(()=>this.fetchFeatures(),t))}async getLastRefreshTimestamp(){const t=await this.storage.get(this.lastUpdateKey),e=await b({appName:this._config.appName,sessionId:this._config.sessionId,currentTime:this._config.currentTime,userId:this._config.userId,environment:this._config.environment,properties:this._config.properties});return(t==null?void 0:t.key)===e?t.timestamp:0}setReady(){this.readyEventEmitted=!0,this.emit(h.READY)}async storeLastRefreshTimestamp(){this.lastRefreshTimestamp=Date.now();const e={key:await b({appName:this._config.appName,sessionId:this._config.sessionId,currentTime:this._config.currentTime,userId:this._config.userId,environment:this._config.environment,properties:this._config.properties}),timestamp:this.lastRefreshTimestamp};await this.storage.save(this.lastUpdateKey,e)}async resolveSessionId(){let t=await this.storage.get(p);return t||(t=Math.floor(Math.random()*1e9),await this.storage.save(p,t.toString(10))),t.toString(10)}isUpToDate(){const t=Date.now(),e=this._config.refreshInterval&&this._config.refreshInterval>500?this._config.refreshInterval:g;return this.lastRefreshTimestamp>0&&this.lastRefreshTimestamp<=t&&t-this.lastRefreshTimestamp<=e}initialFetchFeatures(){if(this.isUpToDate()){this.fetchedFromServer||(this.fetchedFromServer=!0,this.setReady());return}return this.fetchFeatures()}async fetchFeatures(){if(this.fetch){this.abortController&&this.abortController.abort(),this.abortController=D();const t=this.abortController?this.abortController.signal:void 0;try{const e=new URL("/ab/v1/feature/frontend",this.url),i="GET";e.searchParams.set("appName",this._config.appName),e.searchParams.set("environment",this._config.environment??""),e.searchParams.set("userId",this._config.userId??""),e.searchParams.set("sessionId",this._config.sessionId??""),e.searchParams.set("currentTime",this._config.currentTime??new Date().toString());for(let n of Object.entries(this._config.properties??{}))e.searchParams.set(n[0],n[1]);const r=await this.fetch(e.toString(),{method:i,cache:"no-cache",headers:this.getHeaders(),signal:t});if(this.state==="error"&&r.status<400&&(this.state="healthy",this.emit(h.RECOVERED)),r.ok){this.etag=r.headers.get("ETag")||"";const n=await r.json();await this.storeFeatures(n),this.state!=="healthy"&&(this.state="healthy"),this.fetchedFromServer||(this.fetchedFromServer=!0,this.setReady()),this.storeLastRefreshTimestamp()}else r.status===304?this.storeLastRefreshTimestamp():(console.error("AbFlags: Fetching feature toggles did not have an ok response"),this.state="error",this.emit(h.ERROR,{type:"HttpError",code:r.status}),this.lastError={type:"HttpError",code:r.status})}catch(e){typeof e=="object"&&e!==null&&"name"in e&&e.name==="AbortError"||(console.error("AbFlags: unable to fetch feature toggles",e),this.state="error",this.emit(h.ERROR,e),this.lastError=e)}finally{this.abortController=null}}}async storeFeatures(t){this.features=t,this.emit(h.UPDATE),await this.storage.save(this.storeKey,t)}getHeaders(){const t={[m]:this._config.clientKey,Accept:"application/json"};return t["Content-Type"]="application/json",this.etag&&(t["If-None-Match"]=this.etag),Object.entries(this._config.customHeaders??{}).filter(v).forEach(([e,i])=>t[e]=i),t}isEnabled(t){var i;const e=!!((i=this.features)!=null&&i.find(r=>r.name===t));return this.metrics.count(t,e),e}}c.AbClient=F,Object.defineProperty(c,Symbol.toStringTag,{value:"Module"})});
//# sourceMappingURL=index.umd.js.map
