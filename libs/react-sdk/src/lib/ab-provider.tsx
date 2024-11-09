import React, {createContext, useContext, useEffect, useMemo} from "react";
import {AbClient} from "@abflags/js-sdk";

interface IAbContext {
  url: string;
  clientKey: string;
  appName: string;
  userId: string;
  refreshInterval?: number;
  metricsInterval?: number;
  disableMetrics?: boolean;
  client?: AbClient;
}

const AbContext = createContext<IAbContext>({
  url: 'https://abflags.wolfx.app',
  clientKey: '',
  appName: '',
  userId: '',
  client: undefined
});

export const AbProvider = ({children, config}: { config: IAbContext, children: React.ReactNode }) => {
  const [client, setClient] = React.useState<AbClient>()

  useEffect(() => {
    const client = new AbClient({
      url: config.url,
      clientKey: config.clientKey,
      appName: config.appName,
      userId: config.userId,
      disableMetrics: config.disableMetrics ?? false,
      metricsInterval: config.metricsInterval ?? 5000,
      refreshInterval: config.refreshInterval ?? 5000,
    })

    setClient(client)

    client.start();
    // client.on('initialized', () => console.log('initialized'));
    // client.on('error', (error: any) => console.log('error', error));
    // client.on('ready', () => {
    // });
    // client.on('impression', () => console.log('impression'));
    // client.on('update', () => {
    //     console.log('update')
    //   }
    // );
  }, [config])

  const contextValue = useMemo(
    () => ({
      ...config,
      client,
    }),
    [config, client]
  );

  return (
    <>
      <AbContext.Provider value={contextValue}>{children}</AbContext.Provider>
    </>
  );
};

export const useAbflags: () => (IAbContext) = () => {
  return useContext(AbContext);
};
