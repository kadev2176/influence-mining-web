import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi"
import { AuctionContractAddress } from "../models/parami";
import AuctionContract from '../contracts/Auction.json';

export const usePreBid = (address: string, tokenId: number) => {
  const { config, error: prepareError } = usePrepareContractWrite({
    address: AuctionContractAddress,
    abi: AuctionContract.abi,
    functionName: 'preBid',
    args: [address, tokenId]
  });
  const { data, isLoading: writeLoading, write: preBid, isError, error } = useContractWrite(config);
  const { isLoading: waitTxLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return {
    preBid,
    isLoading: writeLoading || waitTxLoading,
    isSuccess,
    isError,
    error,
    prepareError
  }
}