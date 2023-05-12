import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { EIP5489ForInfluenceMiningContractAddress } from "../models/parami";
import EIP5489ForInfluenceMining from '../contracts/EIP5489ForInfluenceMining.json';

export const useAuthorizeSlotTo = (tokenId: string, slotManagerAddress: string) => {
  const { data: currentSlotManager } = useContractRead<unknown[], string, string>({
    address: EIP5489ForInfluenceMiningContractAddress,
    abi: EIP5489ForInfluenceMining.abi,
    functionName: 'tokenId2AuthorizedAddress',
    args: [tokenId],
  });

  const { config, error: prepareError } = usePrepareContractWrite({
    address: EIP5489ForInfluenceMiningContractAddress,
    abi: EIP5489ForInfluenceMining.abi,
    functionName: 'authorizeSlotTo',
    args: [tokenId, slotManagerAddress]
  });
  
  const { data, isLoading: writeLoading, write: authorizeSlotTo, isError, error } = useContractWrite(config);
  const { isLoading: waitTxLoading, isSuccess: authorizeSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return {
    authorizeSlotTo,
    currentSlotManager,
    isLoading: writeLoading || waitTxLoading,
    isSuccess: authorizeSuccess,
    isError,
    error,
    prepareError
  }
}