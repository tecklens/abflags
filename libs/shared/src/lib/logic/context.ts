export interface Properties {
  [key: string]: string | undefined | number;
}
export interface Context {
  currentTime?: Date;
  userId?: string;
  sessionId?: string;
  remoteAddress?: string;
  environment?: string;
  appName?: string;
  properties?: Properties;
}
