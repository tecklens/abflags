export type AbContext = {
  appName: string;
  environment?: string;
  userId?: string;
  sessionId?: string;
  currentTime?: string;
  properties?: {
    [key: string]: string;
  };
}

export type LastUpdateTerms = {
  key: string;
  timestamp: number;
};
