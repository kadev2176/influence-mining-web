import { PARAMI_AIRDROP } from "../models/parami";
import { fetchWithCredentials } from "../utils/api.util";

export const claimToken = async (bidId: string, tags: string[]) => {
  const data = {
    bidId: '46368947434159255729594421132936372433627765618616351696110617778694083182289',
    tags: ['Twitter'],
  }

  const resp = await fetchWithCredentials(`${PARAMI_AIRDROP}/relayer/api/viewer/claim_ad_reward`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  })

  if (!resp) {
    return null;
  }

  return await resp.json();
}