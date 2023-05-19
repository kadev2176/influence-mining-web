import { PARAMI_AIRDROP } from "../models/parami";
import { fetchWithCredentials } from "../utils/api.util";

export const claimToken = async (bidId: string, tags: string[]) => {
  const data = {
    bidId,
    tags,
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

  if (resp.ok) {
    return {
      success: true,
    }
  }

  return await resp.json();
}