import { useAccount, useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from "wagmi"
import { SignatureERC20WithdrawContractAddress } from "../models/parami"
import SignatureERC20Withdraw from '../contracts/SignatureERC20Withdraw.json';

export const useWithdrawAD3 = (amount?: string, nonce?: string, sig?: string) => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  
  const { config } = usePrepareContractWrite({
    address: SignatureERC20WithdrawContractAddress,
    abi: SignatureERC20Withdraw.abi,
    functionName: 'withdraw',
    args: [address, chain?.id, amount, nonce, sig]
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