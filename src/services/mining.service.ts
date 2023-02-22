import { PARAMI_AIRDROP } from "../models/parami";
import { doGraghQueryIM, fetchWithSig } from "../utils/api.util";

export type Balance = {
  total: string;
  withdrawable: string;
  locked: string;
}

// imAccount
// todo: linkedTo
export type ImAccount = {
  wallet: string;
  chainId: number;
  influence: string;
  ad3Balance: number;
  accountReferalCount: number;
  pluginReferalCount: number;
  updatedTime: number;
  beginMiningTime: number;
  beginPreemptTime: number;
  hnftContractAddr: string;
  hnftTokenId: string;
  twitterProfileImageUri: string;
  linkedTo: string;
  hasDao: boolean;
  tweetStats: string;
  tweetId?: string;
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

export const queryAllImAccounts = async (query: string, address: string) => {
  const graphQlQuery = `{
    allImAccounts(${query}) {
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
        hnftTokenId,
        tweetStats
      }
    }
  }`;

  const res = await doGraghQueryIM(graphQlQuery, address);

  if (!res) {
    return;
  }

  const { data } = await res.json();
  const accounts = data.allImAccounts.nodes as ImAccount[];
  return accounts.map(account => {
    const tweetStats = JSON.parse(account.tweetStats);
    return { ...account, tweetId: tweetStats.tweet_id } as ImAccount;
  });
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
  const data = JSON.stringify({ chainId: chainId });
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

export const queryYFIStakingActivity = async (address: string) => {
  const query = `{
    yfiStakingActivity {
      id
    }
  }`

  const res = await doGraghQueryIM(query, address);

  if (!res) {
    return;
  }

  const { data } = await res.json();
  console.log('got yfiStakingActivity data', data);
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
  const query = `filter: { and: [{wallet: {equalTo: "${address.toLowerCase()}"}}, {chainId: {equalTo: ${chainId}}}]}`;
  const accounts = await queryAllImAccounts(query, address);
  if (!accounts) {
    return;
  }
  return accounts[0];
}

export const getLeaderBoardImAccounts = async (address: string, chainId: number) => {
  const query = `orderBy: INFLUENCE_DESC, first: 20, filter: {chainId: {equalTo: ${chainId}}}`;
  return queryAllImAccounts(query, address);
}

export const getNumOfMembersOfDao = async (address: string, kolWallet: string, kolChainId: number) => {
  const query = `{
    allJoinDaoApplications(filter: {and: [{kolWallet: {equalTo: "${kolWallet.toLowerCase()}"}}, {kolChainId: {equalTo: ${kolChainId}}}, {status: {equalTo: "approved"}}]}) {
      nodes {
        id,
        status,
        kolWallet,
        kolChainId,
        memberWallet
      }
    }
  }`;

  const res = await doGraghQueryIM(query, address);

  if (!res) {
    return 0;
  }

  const { data } = await res.json();
  return data.allJoinDaoApplications.nodes.length;
}

export const getDaoApplicationOfWallet = async (address: string, chainId: number) => {
  const query = `{
    allJoinDaoApplications(filter: {and: [{memberWallet: {equalTo: "${address.toLowerCase()}"}}, {memberChainId: {equalTo: ${chainId}}}, {not: {status: {equalTo: "cancelled"}}}]}) {
      nodes {
        id,
        status,
        kolWallet,
        kolChainId
      }
    }
  }`;

  const res = await doGraghQueryIM(query, address);

  if (!res) {
    return;
  }

  const { data } = await res.json();
  return data.allJoinDaoApplications.nodes[0];
}

export const getPendingApplicationsForMe = async (address: string, chainId: number) => {
  const query = `{
    allJoinDaoApplications(filter: {and: [{kolWallet: {equalTo: "${address.toLowerCase()}"}}, {kolChainId: {equalTo: ${chainId}}}, {status: {equalTo: "pending"}}]}) {
      nodes {
        id,
        status,
        kolWallet,
        kolChainId,
        memberWallet
      }
    }
  }`;

  const res = await doGraghQueryIM(query, address);

  if (!res) {
    return;
  }

  const { data } = await res.json();
  return data.allJoinDaoApplications.nodes;
}

export const getAvailableDaos = async (address: string, chainId: number) => {
  // todo: filter dao applicable
  const query = `{
    allImAccounts(first: 20, filter: {chainId: {equalTo: 5}}) {
      nodes {
        wallet,
        chainId,
        influence,
        ad3Balance,
        accountReferalCount,
        pluginReferalCount,
        updatedTime,
        beginMiningTime,
        beginPreemptTime,
        twitterProfileImageUri,
        hnftContractAddr,
        hnftTokenId,
        daoApplicable
      }
    }
  }`;

  const res = await doGraghQueryIM(query, address);

  if (!res) {
    return;
  }

  const { data } = await res.json();
  return data.allImAccounts.nodes as ImAccount[];
}

export const createInfluenceMiningPool = async () => {
  return;
}

export const applyForDao = async (address: string, chainId: number, kolWallet: string, kolChainId: number) => {
  const data = JSON.stringify({
    chainId,
    kolWallet,
    kolChainId,
  });

  const resp = await fetchWithSig(`${PARAMI_AIRDROP}/influencemining/api/dao/join-applications`, address, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: data
  });
  return resp;
}

export const exitDao = async (address: string, chainId: number, daoApplicationId: number) => {
  const data = JSON.stringify({
    chainId,
  });

  const resp = await fetchWithSig(`${PARAMI_AIRDROP}/influencemining/api/dao/join-applications/${daoApplicationId}/exit`, address, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: data
  });
  return resp;
}

export const approveDaoApplication = async (address: string, chainId: number, daoApplicationId: number) => {
  const data = JSON.stringify({
    chainId,
  });

  const resp = await fetchWithSig(`${PARAMI_AIRDROP}/influencemining/api/dao/join-applications/${daoApplicationId}/approve`, address, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: data
  });
  return resp;
}

export const TestGetSomeImAccounts = async () => {
  const query = `{
    allImAccounts(first:20) {
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

  const res = await doGraghQueryIM(query, '0xFb26cC1f046ec231B7Df3042049afeacdE7B0BCC');

  if (!res) {
    return;
  }

  const { data } = await res.json();
  return data.allImAccounts.nodes as ImAccount[];
}

export const getQueryFields = async () => {
  const query = `{
    __schema {
      queryType {
        fields {
          name
        }
      }
    }
  }`

  // const query = `
  // {
  //   __schema {
  //     mutationType {
  //       fields {
  //         name
  //       }
  //     }
  //   }
  // }
  // `

  const res = await doGraghQueryIM(query, '0xFb26cC1f046ec231B7Df3042049afeacdE7B0BCC');

  if (!res) {
    return;
  }

  const { data } = await res.json();
  console.log('query fields', data);
}
