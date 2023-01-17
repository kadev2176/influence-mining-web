import { PARAMI_AIRDROP } from "../models/parami";

export type Balance = {
  total: string;
  withdrawable: string;
  locked: string;
}

export type Influence = {
  influence: number;
  twitFollowerCount: number;
  twitCountWithHnftTag: number;
  ad3Balance: number;
  accountReferalCount: number;
  pluginReferalCount: number;
  updatedTime: number;
  beginMiningTime: number;
  hNFTContractAddr: string;
  hNFTTokenId: string;
  imageUrl: string;
}

export type Ad3Tx = {
  timestamp: number;
  type: string;
  diff: bigint;
}

export type InfluenceTransaction = {
  timestamp: number;
  type: string;
  diff: number;
}

export interface PoolSummary {
  totalInfluence: string;
  currentDailyOutput: string;
}

export const bindAccount = async (address: string, chainId: number, oauthToken: string, oauthVerifier: string, signature: string, msg: string, referer?: string) => {
  const data = JSON.stringify({
    wallet: address,
    chainId,
    oauth_token: oauthToken,
    oauth_verifier: oauthVerifier,
    sig: signature,
    sigPlainText: msg,
    refererWallet: referer
  });

  const resp = await fetch(`${PARAMI_AIRDROP}/influencemining/api/accounts`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: data
  });

  if (resp.ok) {
    return {
      success: true
    }
  }

  const { message } = await resp.json() as { message: string };
  return {
    success: false,
    message
  }
}

export const startMining = async (address: string, chainId: number, hnftContract: string, hnftTokenId: string) => {
  try {
    const data = JSON.stringify({
      wallet: address,
      chain_id: chainId,
      hNFTContractAddr: hnftContract,
      hNFTTokenId: hnftTokenId
    });

    const resp = await fetch(`${PARAMI_AIRDROP}/influencemining/api/accounts/current/beginmining`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data
    });
    return await resp.json();
  } catch (_) {
    return true;
  }
}

export const getAd3Balance = async (address: string) => {
  const res = await fetch(`${PARAMI_AIRDROP}/influencemining/api/ad3?wallet=${address}`);
  const balance = await res.json();
  return balance as Balance;
}

export const getAd3Transactions = async (address: string, chainId: number) => {
    const res = await fetch(`${PARAMI_AIRDROP}/influencemining/api/ad3/transactions?wallet=${address}&chainId=${chainId}`);
    const txs = await res.json();
    return txs as Ad3Tx[];
}

export const getInfluence = async (address: string, chainId: number) => {
  // return null;
  // if (true) {
  //   return {
  //     influence: 500,
  //     twitFollowerCount: 3,
  //     twitCountWithHnftTag: 4,
  //     ad3Balance: 10,
  //     accountReferalCount: 2,
  //     pluginReferalCount: 4,
  //     updatedTime: 170000,
  //     beginMiningTime: 2000000,
  //     imageUrl: 'https://pbs.twimg.com/profile_images/1611305582367215616/4W9XpGpU_200x200.jpg'
  //   } as Influence
  // }
  try {
    const data = JSON.stringify({ wallet: address, chain_id: chainId });
    const resp = await fetch(`${PARAMI_AIRDROP}/influencemining/api/influence`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data
    });

    const influence = await resp.json() as Influence;

    if (resp.ok) {
      return {
        ...influence,
        imageUrl: 'https://pbs.twimg.com/profile_images/1611305582367215616/4W9XpGpU_200x200.jpg'
      };
    }
    
    return null;
  } catch (_) {
    return null
  }
}

export const getInfluenceTransactions = async (address: string, chainId: number) => {
  try {
    const resp = await fetch(`${PARAMI_AIRDROP}/influencemining/api/influence/transactions?wallet=${address}&chain_id=${chainId}`);
    const txs = await resp.json();
    return txs as InfluenceTransaction[];
  } catch (_) {
    return [
      { timestamp: 1672386184, type: "referral", diff: 1.3 },
      { timestamp: 1672386284, type: "tweet", diff: 2.5 },
    ]
  }
}

export const getPoolSummary = async () => {
  const resp = await fetch(`${PARAMI_AIRDROP}/influencemining/api/pool/summary`);
  const summary = await resp.json();
  return summary as PoolSummary;
}
