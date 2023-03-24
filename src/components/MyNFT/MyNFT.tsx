import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { useHNFT } from '../../hooks/useHNFT';
import ConnectWalletModal from '../ConnectWalletModal/ConnectWalletModal';
import './MyNFT.scss';

export interface MyNFTProps { }

function MyNFT({ }: MyNFTProps) {
    const { isConnected } = useAccount();
    const [connectWalletModal, setConnectWalletModal] = useState<boolean>();
    const hnft = useHNFT();

    return <>
        <div className='my-nft-container'>
            {!isConnected && <>
                <div className='no-connect' onClick={() => {
                    setConnectWalletModal(true);
                }}>
                    Connect wallet to view NFT
                </div>
            </>}

            {isConnected && <>
                {!hnft.balance && <>
                    <div className='no-hnft' onClick={() => {
                        // open mint hnft modal
                    }}>
                        Mint My HNFT
                    </div>
                </>}

                {hnft.balance && <>

                </>}
            </>}
        </div>

        {connectWalletModal && <>
            <ConnectWalletModal onCancel={() => { setConnectWalletModal(false) }}></ConnectWalletModal>
        </>}
    </>;
};

export default MyNFT;
