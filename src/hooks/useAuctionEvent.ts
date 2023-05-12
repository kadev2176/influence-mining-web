import { useContractEvent } from "wagmi"
import { AuctionContractAddress } from "../models/parami"
import AuctionContract from '../contracts/Auction.json';
import { useState } from "react";

export const useAuctionEvent = (eventName: string, listener: (...args: any[]) => void) => {
  const unwatch = useContractEvent({
    address: AuctionContractAddress,
    abi: AuctionContract.abi,
    eventName: eventName,
    listener: listener
  })

  return {
    unwatch,
  }
}