import { useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import { getInfluence, Influence } from "../services/mining.service";

export const useInfluence = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [influence, setInfluence] = useState<Influence>();

  useEffect(() => {
    refresh();
  }, [address, chain]);  

  const refresh = () => {
    if (address && chain?.id) {
      getInfluence(address, chain.id).then(influence => {
        if (influence) {
          setInfluence(influence);
        }
      })
    }
  }

  return {
    influence,
    refresh
  };
}