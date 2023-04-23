import { useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import { BillboardLevel2MiningPower, BillboardLevel2Name, EIP5489ForInfluenceMiningContractAddress } from "../models/parami";
import EIP5489ForInfluenceMining from '../contracts/EIP5489ForInfluenceMining.json';
import { BigNumber } from "ethers";

export interface HNFT {
  address?: string;
  balance?: number;
  description?: string;
  image?: string;
  name?: string;
  tokenId?: string;
  level?: string;
  levelName?: string;
  miningPower?: number;
  onWhitelist?: boolean;
  refetch: () => void;
}

export const useHNFT = () => {
  const { address } = useAccount();

  const { data: nftBalance, refetch: refetchBalance } = useContractRead<unknown[], string, BigNumber>({
    address: EIP5489ForInfluenceMiningContractAddress,
    abi: EIP5489ForInfluenceMining.abi,
    functionName: 'balanceOf',
    args: [address],
  });

  const { data: tokenId, refetch: refetchTokenId } = useContractRead<unknown[], string, BigNumber>({
    address: EIP5489ForInfluenceMiningContractAddress,
    abi: EIP5489ForInfluenceMining.abi,
    functionName: 'tokenOfOwnerByIndex',
    args: [address, 0],
  });

  const { data: tokenUri, refetch: refetchTokenUri } = useContractRead<unknown[], string, string>({
    address: EIP5489ForInfluenceMiningContractAddress,
    abi: EIP5489ForInfluenceMining.abi,
    functionName: 'tokenURI',
    args: [tokenId],
  });

  const { data: level, refetch: refetchLevel } = useContractRead<unknown[], string, string>({
    address: EIP5489ForInfluenceMiningContractAddress,
    abi: EIP5489ForInfluenceMining.abi,
    functionName: 'token2Level',
    args: [tokenId],
  });

  const { data: onWhitelist, refetch: refetchWhitelistStatus } = useContractRead<unknown[], string, BigNumber>({
    address: EIP5489ForInfluenceMiningContractAddress,
    abi: EIP5489ForInfluenceMining.abi,
    functionName: 'kolWhiteList',
    args: [address],
  });

  const token = tokenUri ? JSON.parse(Buffer.from(tokenUri.slice(29), 'base64').toString()) : {}

  const levelString = level?.toString() ?? '0';

  const hnft: HNFT = {
    ...token,
    tokenId: tokenId?.toString(),
    address: EIP5489ForInfluenceMiningContractAddress,
    balance: nftBalance?.toNumber() ?? 0,
    onWhitelist: onWhitelist,
    level: levelString,
    levelName: BillboardLevel2Name[levelString],
    miningPower: BillboardLevel2MiningPower[levelString],
    refetch: () => {
      refetchBalance();
      refetchTokenId();
      refetchTokenUri();
      refetchLevel();
      refetchWhitelistStatus();
    }
  };

  return hnft;
}