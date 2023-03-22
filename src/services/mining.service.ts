import { doGraghQueryIM, fetchWithCredentials, fetchWithSig } from "../utils/api.util";
import { formatTwitterImageUrl } from "../utils/format.util";

const PARAMI_AIRDROP = process.env.REACT_APP_AIRDROP_API_URL;

export type Balance = {
  earned: string;
  balance: string;
}

// imAccount
// todo: linkedTo
export type ImAccount = {
  id: string;
  wallet: string;
  chainId: number;
  influence: string;
  ad3Balance: string;
  accountReferalCount: number;
  pluginReferalCount: number;
  updatedTime: number;
  beginPreemptTime: number;
  hnftContractAddr: string;
  hnftTokenId: string;
  linkedTo: string;
  hasDao: boolean;
  tweetStats: string;
  tweetId?: string;
  tweetContent?: string;
  tweetEvaluation?: string;
  twitterId: string;
  twitterAccount: string;
  twitterProfileImageUri: string;
  twitterUsername: string;
  twitterName: string;
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

export interface UpcomingTweetMiner {
  id: string;
  userId: string;
  tweetId: string;
  createdTime: string;
}

export interface Ad3Activity {
  dailyOutput: string;
  earningsPerShare: string;
  finished: boolean;
  halveTime: number;
  lastProfitTime: number;
  miningBalance: string;
  rewardBudget: string;
  rewardRemain: string;
  startTime: number;
}

export const queryAllImAccounts = async (query: string) => {
  const graphQlQuery = `{
    allImAccounts(${query}) {
      nodes {
        id,
        wallet,
        influence,
        ad3Balance,
        accountReferalCount,
        pluginReferalCount,
        updatedTime,
        beginPreemptTime,
        hnftContractAddr,
        hnftTokenId,
        tweetStats,
        twitterId,
        twitterAccount
      }
    }
  }`;

  const res = await doGraghQueryIM(graphQlQuery, '');

  if (!res) {
    return;
  }

  const { data } = await res.json();
  const accounts = data.allImAccounts.nodes as ImAccount[];
  return accounts.map(account => {
    const twitterAccount = JSON.parse(account.twitterAccount);
    const tweetStats = JSON.parse(account.tweetStats);
    return {
      ...account,
      tweetId: tweetStats.tweet_id,
      tweetContent: tweetStats.tweet_content,
      tweetEvaluation: tweetStats.evaluation,
      twitterUsername: twitterAccount.username,
      twitterName: twitterAccount.name,
      twitterProfileImageUri: formatTwitterImageUrl(twitterAccount.profile_image_url),
    } as ImAccount;
  });
}

export const getTwitterOauthUrl = async () => {
  try {
    const resp = await fetch(`${PARAMI_AIRDROP}/influencemining/api/twitter/login?state=gptminer_login`);
    const { oauthUrl } = await resp.json();
    return oauthUrl;
  } catch (e) {
    console.log('request_oauth_token error', e);
    return;
  }
}

// todo: add referer?
export const createAccountOrLogin = async (ticket: string) => {
  const data = JSON.stringify({
    ticket
  });

  const resp = await fetch(`${PARAMI_AIRDROP}/influencemining/api/accounts`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: data,
    credentials: 'same-origin'
  })

  if (resp.ok) {
    const authCookies = await resp.json() as {
      authcookiebytwitter: string,
      expiretime: string,
      userid: string
    };

    window.localStorage.setItem('authcookiebytwitter', `${authCookies.authcookiebytwitter}`);
    window.localStorage.setItem('expiretime', `${authCookies.expiretime}`);
    window.localStorage.setItem('userid', `${authCookies.userid}`);

    return {
      success: true
    }
  }

  const { message } = await resp.json() as { message: string };
  return {
    success: false,
    status: resp.status,
    message,
  }
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

export const getAd3Balance = async () => {
  const res = await fetchWithCredentials(`${PARAMI_AIRDROP}/influencemining/api/ad3`);
  if (!res) {
    return;
  }
  const balance = await res.json();
  return balance as Balance;
}

export const getAd3Transactions = async (address: string, chainId: number) => {
  const res = await fetchWithSig(`${PARAMI_AIRDROP}/influencemining/api/ad3/transactions?wallet=${address}&chain_id=${chainId}`, address);
  const txs = await res.json();
  return txs as Ad3Tx[];
}

export const updateInfluence = async () => {
  const resp = await fetchWithCredentials(`${PARAMI_AIRDROP}/influencemining/api/influence`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
  });
  if (!resp) {
    return;
  }
  return await resp.json();
}

export const getInfluenceTransactions = async (address: string, chainId: number) => {
  const resp = await fetchWithSig(`${PARAMI_AIRDROP}/influencemining/api/influence/transactions?wallet=${address}&chain_id=${chainId}`, address);
  const txs = await resp.json();
  return txs as InfluenceTransaction[];
}

export const getPoolSummary = async () => {
  const resp = await fetchWithCredentials(`${PARAMI_AIRDROP}/influencemining/api/pool/summary`);
  if (!resp) {
    return;
  }
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

export const getMyIMAccount = async () => {
  const query = `filter: { id: {equalTo: ${localStorage.getItem('userid') as string}}}`;
  const accounts = await queryAllImAccounts(query);
  if (!accounts) {
    return;
  }
  return accounts[0];
}

export const getLeaderBoardImAccounts = async () => {
  const query = `orderBy: INFLUENCE_DESC, first: 20`;
  return queryAllImAccounts(query);
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

export const getUpcomingTweetMiner = async () => {
  const query = `{
    allComingTweetMiners(last:1, filter: {userId: {equalTo: ${localStorage.getItem('userid')}}}) {
      nodes {
        id,
        userId,
        tweetId,
        createdTime
      }
    }
  }`;

  const res = await doGraghQueryIM(query, '');


  if (!res) {
    return;
  }

  const { data } = await res.json();
  return data.allComingTweetMiners.nodes[0] as UpcomingTweetMiner;
}

export const getAD3Activity = async () => {
  // todo: only 1 activity for now
  const query = `{
    allYfiStakingActivities(first:1) {
      nodes {
        startTime,
        rewardBudget,
        rewardRemain,
        earningsPerShare,
        miningBalance,
        dailyOutput,
        halveTime,
        lastProfitTime,
        finished
      }
    }
  }`
  const res = await doGraghQueryIM(query, '');

  if (!res) {
    return;
  }

  const { data } = await res.json();
  console.log('ad3 activity', data);
  return data.allYfiStakingActivities.nodes[0] as Ad3Activity;
}

export const _TestGetSomeImAccounts = async () => {
  const query = `{
    allImAccounts(first:20) {
      nodes {
        wallet,
        influence,
        ad3Balance,
        accountReferalCount,
        pluginReferalCount,
        updatedTime,
        beginPreemptTime,
        twitterProfileImageUri,
        hnftContractAddr,
        hnftTokenId,
        id
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

export const _getQueryFields = async () => {
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
