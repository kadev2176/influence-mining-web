import { useContractRead } from "wagmi";
import { AuctionContractAddress } from "../models/parami";
import AuctionContract from '../contracts/Auction.json';

export const useCurBid = (address: string, tokenId: number) => {
  const { data: curBid } = useContractRead<unknown[], any, any>({
    address: AuctionContractAddress,
    abi: AuctionContract.abi,
    functionName: 'curBid',
    args: [address, tokenId],
  });

  return curBid;
}

