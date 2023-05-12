import { PARAMI_AIRDROP } from "../models/parami";
import { fetchWithCredentials } from "../utils/api.util";

export const createBid = async (bidderId: string, adId: number, hnftContractAddress: string, tokenId: string, governanceTokenAmount: string, governanceTokenRemain: string) => {
  // todo: amount = tokenRemain
  try {
    const data = JSON.stringify({
      bidder_id: bidderId,
      ad_id: adId,
      hnft_contract: hnftContractAddress,
      hnft_token_id: tokenId,
      governance_token_amount: governanceTokenAmount,
      governance_token_remain: governanceTokenRemain
    });

    const resp = await fetchWithCredentials(`${PARAMI_AIRDROP}/realyer/api/advertiser/auction/bid`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data
    })

    if (!resp) {
      return;
    }

    const bidWithSig = await resp.json();
    return bidWithSig;
  } catch (e) {
    console.log('create bid error', e);
    return;
  }
}
