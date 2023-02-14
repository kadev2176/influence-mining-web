import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { EIP5489ForInfluenceMiningContractAddress } from "../models/parami";
import EIP5489ForInfluenceMining from '../contracts/EIP5489ForInfluenceMining.json';

export const useHnftLinkTo = (tokenId = '0', targetTokenId = '0') => {

  const { config } = usePrepareContractWrite({
    address: EIP5489ForInfluenceMiningContractAddress,
    abi: EIP5489ForInfluenceMining.abi,
    functionName: 'linkTo',
    args: [tokenId, targetTokenId]
  });

  const { data, isLoading: writeLoading, write: linkTo, isError, error } = useContractWrite(config);
  const { isLoading: waitTxLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return {
    linkTo,
    isLoading: writeLoading || waitTxLoading,
    isSuccess,
    isError: isError,
    error
  }
}
