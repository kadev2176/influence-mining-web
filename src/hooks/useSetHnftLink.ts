import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";

export const useHnftSetLinkTo = (address: string, tokenId: string) => {

  const { config } = usePrepareContractWrite({
    address: '0x111',
    abi: [] as any,
    functionName: 'setLinkTo',
    args: [address, tokenId]
  });

  const { data, isLoading: writeLoading, write: setLinkTo, isError } = useContractWrite(config);
  const { isLoading: waitTxLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return {
    setLinkTo,
    isLoading: writeLoading || waitTxLoading,
    isSuccess,
    isError: isError
  }
}
