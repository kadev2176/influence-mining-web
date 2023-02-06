import { IM_SUBQUERY, PARAMI_SUBQUERY } from "../models/parami";

export const fetchWithSig = async (input: RequestInfo | URL, address: string, init?: RequestInit) => {
  const options = init ?? {};
  return fetch(input, {
    ...options,
    headers: {
      ...options.headers,
      wallet: address,
      sessionSig: localStorage.getItem('sessionSig') as string,
      sessionExpirationTime: localStorage.getItem('sessionExpirationTime') as string
    }
  })
}

export const doGraghQueryParami = async (query: string) => {
  const obj: any = {};
  obj.operationName = null;
  obj.variables = {};
  obj.query = query;
  return fetch(PARAMI_SUBQUERY, {
    "headers": {
      "content-type": "application/json",
    },
    "body": JSON.stringify(obj),
    "method": "POST"
  });
};

export const doGraghQueryIM = async (query: string, address: string) => {
  const obj: any = {};
  obj.operationName = null;
  obj.variables = {};
  obj.query = query;
  return fetchWithSig(IM_SUBQUERY, address, {
    "headers": {
      "content-type": "application/json",
    },
    "body": JSON.stringify(obj),
    "method": "POST"
  });
};
