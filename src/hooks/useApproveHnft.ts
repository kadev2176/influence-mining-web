import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi"
import { AD3ContractAddress, EIP5489ForInfluenceMiningContractAddress } from "../models/parami"
import EIP5489ForInfluenceMining from '../contracts/EIP5489ForInfluenceMining.json';

export const useApproveHnft = (spender: string, tokenId: string) => {
  const { config, error: prepareError } = usePrepareContractWrite({
    address: EIP5489ForInfluenceMiningContractAddress,
    abi: EIP5489ForInfluenceMining.abi,
    functionName: 'approve',
    args: [spender, tokenId]
  });
  const { data, isLoading: writeLoading, write: approve, isError, error } = useContractWrite(config);
  const { isLoading: waitTxLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return {
    approve,
    isLoading: writeLoading || waitTxLoading,
    isSuccess,
    isError,
    error,
    prepareError
  }
}