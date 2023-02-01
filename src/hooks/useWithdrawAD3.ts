import { useAccount, useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from "wagmi"
import { WithdrawAD3Signer } from "../models/parami"

export const useWithdrawAD3 = (amount?: string, nonce?: number, sig?: string) => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  
  const { config } = usePrepareContractWrite({
    address: '0x1',
    abi: [] as any,
    functionName: 'withdraw',
    args: [WithdrawAD3Signer, address, chain?.id, amount, nonce, sig]
  });

  const { data, isLoading: writeLoading, write: withdraw, isError } = useContractWrite(config);
  const { isLoading: waitTxLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return {
    withdraw,
    isError,
    isLoading: writeLoading || waitTxLoading,
    isSuccess
  }
}