import { useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import { getIMAccountOfWallet, ImAccount } from "../services/mining.service";

export const useImAccount = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [imAccount, setImAccount] = useState<ImAccount>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    refresh();
  }, [address, chain]);

  const refresh = () => {
    if (address && chain?.id) {
      setLoading(true);
      getIMAccountOfWallet(address, chain.id).then(imAccount => {
        if (imAccount) {
          setImAccount(imAccount);
        }
        setLoading(false);
      }).catch((e) => {
        console.log('Query imAccount error', e);
        setLoading(false);
      })
    }
  }

  return {
    imAccount,
    loading,
    refresh
  };
}