import { PARAMI_AIRDROP } from "../models/parami";
import { doGraghQueryIM, fetchWithSig } from "../utils/api.util";

export type Balance = {
  total: string;
  withdrawable: string;
  locked: string;
}

// imAccount
export type ImAccount = {
  wallet: string;
  influence: number;
  ad3Balance: number;
  accountReferalCount: number;
  pluginReferalCount: number;
  updatedTime: number;
  beginMiningTime: number;
  beginPreemptTime: number;
  hnftContractAddr: string;
  hnftTokenId: string;
  twitterProfileImageUri: string;
}

export type Ad3Tx = {
  id: string;
  timestamp: number;
  type: string;
  diff: number;
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

export interface WithdrawAd3Signature {
  to: string;
  chain_id: string;
  amount: string;
  nounce: string;
  sig: string;
}

export const bindAccount = async (address: string, chainId: number, oauthToken: string, oauthVerifier: string, referer?: string) => {
  const data = JSON.stringify({
    wallet: address,
    chainId,
    oauth_token: oauthToken,
    oauth_verifier: oauthVerifier,
    refererWallet: referer
  });

  const resp = await fetchWithSig(`${PARAMI_AIRDROP}/influencemining/api/accounts`, address, {
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

    const resp = await fetchWithSig(`${PARAMI_AIRDROP}/influencemining/api/accounts/current/beginmining`, address, {
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

export const startPreempt = async (address: string, chainId: number) => {
  const data = JSON.stringify({
    chainId
  });

  const resp = await fetchWithSig(`${PARAMI_AIRDROP}/influencemining/api/accounts/current/beginpreempt`, address, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: data
  });

  return await resp.json();
}

export const getAd3Balance = async (address: string, chainId: number) => {
  const res = await fetchWithSig(`${PARAMI_AIRDROP}/influencemining/api/ad3?wallet=${address}&chain_id=${chainId}`, address);
  const balance = await res.json();
  return balance as Balance;
}

export const getAd3Transactions = async (address: string, chainId: number) => {
  const res = await fetchWithSig(`${PARAMI_AIRDROP}/influencemining/api/ad3/transactions?wallet=${address}&chain_id=${chainId}`, address);
  const txs = await res.json();
  return txs as Ad3Tx[];
}

export const updateInfluence = async (address: string, chainId: number) => {
  const data = JSON.stringify({ wallet: address, chain_id: chainId });
  const resp = await fetchWithSig(`${PARAMI_AIRDROP}/influencemining/api/influence`, address, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: data
  });
  return await resp.json();
}

export const getInfluenceTransactions = async (address: string, chainId: number) => {
  const resp = await fetchWithSig(`${PARAMI_AIRDROP}/influencemining/api/influence/transactions?wallet=${address}&chain_id=${chainId}`, address);
  const txs = await resp.json();
  return txs as InfluenceTransaction[];
}

export const getPoolSummary = async (address: string) => {
  const resp = await fetchWithSig(`${PARAMI_AIRDROP}/influencemining/api/pool/summary`, address);
  const summary = await resp.json();
  return summary as PoolSummary;
}

export const generateWithdrawSignature = async (address: string, chainId: number, amount: string) => {
  const resp = await fetchWithSig(`${PARAMI_AIRDROP}/influencemining/api/ad3/withdrawals?chain_id=${chainId}&amount=${amount}`, address, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
  });
  const sig = await resp.json();
  return sig as WithdrawAd3Signature;
}

export const getWithdrawSignatureOfTxId = async (txId: string, chainId: number, address: string) => {
  const resp = await fetchWithSig(`${PARAMI_AIRDROP}/influencemining/api/ad3/withdrawals/${txId}?chain_id=${chainId}`, address);
  const sig = await resp.json();
  return sig as WithdrawAd3Signature;
}

export const getImAccountsReadyForBid = async (address: string, chainId: number) => {
  // filter beginPreemptTime & chainId
  // todo: page and pageInfo
  const query = `{
    allImAccounts( filter: { and: [{chainId: {equalTo: ${chainId}}}, { not: {beginPreemptTime: {equalTo: 0}}}]}, first:100 ) {
      nodes {
        wallet,
        influence,
        ad3Balance,
        accountReferalCount,
        pluginReferalCount,
        updatedTime,
        beginMiningTime,
        beginPreemptTime,
        twitterProfileImageUri,
        hnftContractAddr,
        hnftTokenId
      }
      totalCount
      pageInfo {
        hasNextPage
      }
    }
  }`;

  const res = await doGraghQueryIM(query, address);

  if (!res) {
    return;
  }

  const { data } = await res.json();

  // todo: return Page<imAccount>
  return data.allImAccounts.nodes as ImAccount[];
}

export const getIMAccountOfBillboard = async (walletAddress: string, contractAddress: string, tokenId: string) => {
  try {
    // todo: chainId
    const query = `{
      allImAccounts(filter:{ and: [{hnftContractAddr: {equalTo: "${contractAddress.toLowerCase()}"}}, {hnftTokenId: {equalTo: ${Number(tokenId)}}}]}) {
        nodes {
          wallet,
          influence,
          ad3Balance,
          accountReferalCount,
          pluginReferalCount,
          updatedTime,
          beginMiningTime,
          beginPreemptTime,
          twitterProfileImageUri,
          hnftContractAddr,
          hnftTokenId
        }
      }
    }`;

    const res = await doGraghQueryIM(query, walletAddress);

    if (!res) {
      return;
    }

    const { data } = await res.json();
    console.log(data);
    return data.allImAccounts.nodes[0] as ImAccount;
  } catch (e) {
    console.log('query allImAccounts error', e);
  }
}

export const getIMAccountOfWallet = async (address: string, chainId: number) => {
  const query = `{
    allImAccounts( filter: { and: [{wallet: {equalTo: "${address.toLowerCase()}"}}, {chainId: {equalTo: ${chainId}}}]}) {
      nodes {
        wallet,
        influence,
        ad3Balance,
        accountReferalCount,
        pluginReferalCount,
        updatedTime,
        beginMiningTime,
        beginPreemptTime,
        twitterProfileImageUri,
        hnftContractAddr,
        hnftTokenId
      }
    }
  }`;

  const res = await doGraghQueryIM(query, address);

  if (!res) {
    return;
  }

  const { data } = await res.json();
  return data.allImAccounts.nodes[0] as ImAccount;
}

export const applyForDao = async (address: string, tokenId: string) => {

}

export const getAvailableDaos = async (address: string, chainId: number) => {

  const imAccounts = await getIMAccountOfWallet(address, chainId);

  console.log('im accounts', imAccounts);
  return [imAccounts];
}
