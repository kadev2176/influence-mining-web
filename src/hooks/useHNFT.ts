import { useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import { EIP5489ForInfluenceMiningContractAddress } from "../models/parami";
import EIP5489ForInfluenceMining from '../contracts/EIP5489ForInfluenceMining.json';
import { BigNumber } from "ethers";

export interface HNFT {
  address?: string;
  balance?: number;
  description?: string;
  image?: string;
  name?: string;
  tokenId?: string;
  level?: number;
}

export const useHNFT = () => {
  const { address } = useAccount();

  const { data: nftBalance } = useContractRead<unknown[], string, BigNumber>({
    address: EIP5489ForInfluenceMiningContractAddress,
    abi: EIP5489ForInfluenceMining.abi,
    functionName: 'balanceOf',
    args: [address],
  });

  const { data: tokenId } = useContractRead<unknown[], string, BigNumber>({
    address: EIP5489ForInfluenceMiningContractAddress,
    abi: EIP5489ForInfluenceMining.abi,
    functionName: 'tokenOfOwnerByIndex',
    args: [address, 0],
  });

  const { data: tokenUri } = useContractRead<unknown[], string, string>({
    address: EIP5489ForInfluenceMiningContractAddress,
    abi: EIP5489ForInfluenceMining.abi,
    functionName: 'tokenURI',
    args: [tokenId],
  });

  const token = tokenUri ? JSON.parse(Buffer.from(tokenUri.slice(29), 'base64').toString()) : {}

  const hnft: HNFT = {
    ...token,
    tokenId: tokenId?.toString(),
    address: EIP5489ForInfluenceMiningContractAddress,
    balance: nftBalance?.toNumber() ?? 0,
    level: 0
  };

  return hnft;
}