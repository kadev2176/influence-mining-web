import { useAccount, useContractRead } from "wagmi";
import { AD3ContractAddress } from "../models/parami";
import AD3Contract from '../contracts/AD3.json';
import { BigNumber } from "ethers";

export const useAD3Balance = () => {
  const { address } = useAccount();

  const { data: nftBalance } = useContractRead<unknown[], string, BigNumber>({
    address: AD3ContractAddress,
    abi: AD3Contract.abi,
    functionName: 'balanceOf',
    args: [address],
  });

  return nftBalance;
}