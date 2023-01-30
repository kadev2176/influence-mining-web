import { usePrepareContractWrite, useWaitForTransaction, useContractWrite } from "wagmi";
import { EIP5489ForInfluenceMiningContractAddress } from "../models/parami";
import EIP5489ForInfluenceMining from '../contracts/EIP5489ForInfluenceMining.json';

export const useMintBillboard = (level: number | undefined, imageUrl: string) => {
  // todo: mint at level
  const { config } = usePrepareContractWrite({
    address: EIP5489ForInfluenceMiningContractAddress,
    abi: EIP5489ForInfluenceMining.abi,
    functionName: 'mint',
    args: [imageUrl]
  });
  const { data, isLoading: writeLoading, write: mint } = useContractWrite(config);
  const { isLoading: waitTxLoading, isSuccess: mintSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return {
    mint,
    isLoading: writeLoading || waitTxLoading,
    isSuccess: mintSuccess
  }
}
