import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi"
import { AuctionContractAddress, EIP5489ForInfluenceMiningContractAddress } from "../models/parami"
import AuctionContract from '../contracts/Auction.json';

export const useCommitBid = (
  tokenId: string,
  hnftContractAddress: string,
  bidAmount: string,
  slotUri?: string,
  signature?: string,
  curBidId?: string,
  preBidId?: string,
  preBidRemain?: string
) => {
  const { config, error: prepareError } = usePrepareContractWrite({
    address: AuctionContractAddress,
    abi: AuctionContract.abi,
    functionName: 'commitBid',
    args: [[tokenId, hnftContractAddress], bidAmount, slotUri, signature, curBidId, preBidId, preBidRemain]
  });
  const { data, isLoading: writeLoading, write: commitBid, isError, error } = useContractWrite(config);
  const { isLoading: waitTxLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return {
    commitBid,
    isLoading: writeLoading || waitTxLoading,
    isSuccess,
    isError,
    error,
    prepareError
  }
}