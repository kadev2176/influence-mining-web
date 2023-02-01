import { ApiPromise, WsProvider } from "@polkadot/api";
import { useEffect, useState } from "react";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import config from '../config/paramiChain.config';

interface WindowWithApi {
  apiWs?: ApiPromise
}

export const useApiWs = () => {
  const [apiWs, setApiWs] = useState<ApiPromise>();

  const initChain = async () => {
    await cryptoWaitReady();
    const provider = new WsProvider(config.socketServer);
    const api = await ApiPromise.create({
      provider,
      types: config.types,
    });
    (window as WindowWithApi).apiWs = api;
    setApiWs(api);
  };

  useEffect(() => {
    if (!(window as any).apiWs) {
      initChain();
    }
  }, []);

  return apiWs;
}