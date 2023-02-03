import { deleteComma } from "../utils/format.util";

export const getParamiNftExternal = async (nftId: string) => {
  const res = await window.apiWs.query.nft.external(nftId);
  if (res.isEmpty) {
    return null;
  }

  const external = await res.toHuman() as {
    owner: string;
    network: string;
    namespace: string;
    token: string;
  };

  return {
    owner: external.owner,
    network: external.network,
    tokenId: `${parseInt(external.token)}`,
    address: external.namespace
  }
}

export const getAdSlotOfNftId = async (nftId: string) => {
  const slotRes = await window.apiWs.query.ad.slotOf(nftId);
  if (slotRes.isEmpty) {
    return null;
  }

  // todo: bid with ad3, no fractionId?
  return await slotRes.toHuman() as { adId: string, budgetPot: string, fractionId: string };
}

export const getBalanceOfBudgetPot = async (budgetPotId: string, assetId: string) => {
  // todo: when bid with ad3, still need assetId?
  const balanceRes = await window.apiWs.query.assets.account(assetId, budgetPotId);
  if (balanceRes.isEmpty) {
    return null;
  }
  const { balance } = balanceRes.toHuman() as { balance: string };
  return balance;
}

export const getAvailableAd3BalanceOnParami = async (account: string) => {
  const accountRes = await window.apiWs.query.system.account(account);

  if (accountRes.isEmpty) {
    return null;
  }

  const balance = await accountRes.toHuman() as { data: { free: string } };
  return deleteComma(balance.data.free)
}