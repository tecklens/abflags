import {AbContext} from "./context";
import {IStorageProvider} from "../storage";

export type IConfig = {
  url: string;
  clientKey: string;
  disableRefresh?: boolean;
  refreshInterval?: number;
  metricsInterval?: number;
  metricsIntervalInitial?: number;
  disableMetrics?: boolean;

  fetch?: any;

  customHeaders?: Record<string, string>;

  storageProvider?: IStorageProvider;
} & AbContext;
