import { AuctionContractAddress, PARAMI_AIRDROP } from "../models/parami";
import { fetchWithCredentials } from "../utils/api.util";

export interface BidWithSignature {
  id: string;
  ad_id: number;
  bidder_id: number;
  prev_bid_id: string;
  hnft_contract: string;
  hnft_token_id: number;
  governance_token_contract: string;
  governance_token_amount: bigint;
  governance_token_remain?: bigint;
  active?: boolean;
  updated_at?: Date;
  
  sig: string;
  last_bid_remain: string;
};

export const createBid = async (bidderId: string, adId: number, hnftContractAddress: string, tokenId: string, governanceTokenAmount: string) => {
  try {
    const data = JSON.stringify({
      bidder_id: bidderId,
      ad_id: adId,
      hnft_contract: hnftContractAddress,
      hnft_token_id: tokenId,
      governance_token_amount: governanceTokenAmount,
      flag: 1
    });

    const resp = await fetchWithCredentials(`${PARAMI_AIRDROP}/relayer/api/advertiser/auction/bid`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data
    })

    if (!resp) {
      return;
    }

    const bidWithSig = await resp.json() as BidWithSignature;
    return bidWithSig;
  } catch (e) {
    console.log('create bid error', e);
    return;
  }
}
