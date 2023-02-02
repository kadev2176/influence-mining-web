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

export const getAdIdOfNftId = async (nftId: string) => {
  const slotRes = await window.apiWs.query.ad.slotOf(nftId);
  if (slotRes.isEmpty) {
    return null;
  }

  const { adId } = await slotRes.toHuman() as { adId: string };
  return adId;
}

export const getAvailableAd3BalanceOnParami = async (account: string) => {
  const accountRes = await window.apiWs.query.system.account(account);

  if (accountRes.isEmpty) {
    return null;
  }

  const balance = await accountRes.toHuman() as { data: { free: string } };
  return deleteComma(balance.data.free)
}