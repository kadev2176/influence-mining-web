import { useContract, useContractRead, useContractReads } from "wagmi";
import { EIP5489ForInfluenceMiningContractAddress } from "../models/parami";
import EIP5489ForInfluenceMining from '../contracts/EIP5489ForInfluenceMining.json';
import { useEffect, useState } from "react";
import { BigNumber } from "ethers";

const levels = [0, 1, 2, 3, 4];

const influenceMiningLevel2Price = {
  address: EIP5489ForInfluenceMiningContractAddress,
  abi: EIP5489ForInfluenceMining.abi,
  functionName: 'level2Price',
} as any;

export const useBillboardPrices = () => {
  const { data } = useContractReads({
    contracts: [
      { ...influenceMiningLevel2Price, args: [0] },
      { ...influenceMiningLevel2Price, args: [1] },
      { ...influenceMiningLevel2Price, args: [2] },
      { ...influenceMiningLevel2Price, args: [3] },
      { ...influenceMiningLevel2Price, args: [4] },
    ]
  });

  return (data ?? []).map(res => (res ?? '0').toString());
}