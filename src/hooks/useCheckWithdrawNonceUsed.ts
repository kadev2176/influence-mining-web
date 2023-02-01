import { useAccount, useContract, useProvider } from "wagmi"
import { SignatureERC20WithdrawContractAddress } from "../models/parami"
import SignatureERC20Withdraw from '../contracts/SignatureERC20Withdraw.json';

export const useCheckWithdrawNonceUsed = () => {
  const { address } = useAccount();
  const provider = useProvider();
  const contract = useContract({
    address: SignatureERC20WithdrawContractAddress,
    abi: SignatureERC20Withdraw.abi,
    signerOrProvider: provider
  })

  if (!contract || !address) {
    return {}
  }

  const isNonceUsed = async (nonce: string) => {
    const used = await contract.addressNonceUsed(address, nonce);
    return used;
  }

  return {
    isNonceUsed
  }
}