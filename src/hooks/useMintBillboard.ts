import { usePrepareContractWrite, useWaitForTransaction, useContractWrite } from "wagmi";
import { EIP5489ForInfluenceMiningContractAddress } from "../models/parami";
import EIP5489ForInfluenceMining from '../contracts/EIP5489ForInfluenceMining.json';

export const useMintBillboard = (level: number | undefined, imageUrl: string) => {
  const { config, error: prepareError } = usePrepareContractWrite({
    address: EIP5489ForInfluenceMiningContractAddress,
    abi: EIP5489ForInfluenceMining.abi,
    functionName: 'mint',
    args: [imageUrl, level]
  });
  
  const { data, isLoading: writeLoading, write: mint, isError, error } = useContractWrite(config);
  const { isLoading: waitTxLoading, isSuccess: mintSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return {
    mint,
    isLoading: writeLoading || waitTxLoading,
    isSuccess: mintSuccess,
    isError,
    error,
    prepareError
  }
}
