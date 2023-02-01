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