import { notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useHNFT } from '../../hooks/useHNFT';
import { useImAccount } from '../../hooks/useImAccount';
import ConnectWalletModal from '../ConnectWalletModal/ConnectWalletModal';
import './MyNFT.scss';

export interface MyNFTProps { }

function MyNFT({ }: MyNFTProps) {
    const { isConnected } = useAccount();
    const [connectWalletModal, setConnectWalletModal] = useState<boolean>();
    const hnft = useHNFT();
    const { imAccount } = useImAccount();

    useEffect(() => {
        if (isConnected) {
            setConnectWalletModal(false);
        }
    }, [isConnected])

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
                        notification.info({
                            message: 'Coming Soon'
                        })
                    }}>
                        Mint My HNFT
                    </div>
                </>}

                {!!hnft.balance && imAccount && <>
                    <div className='nft-container'>
                        <img className='avatar' src={imAccount.twitterProfileImageUri} referrerPolicy="no-referrer"></img>
                    </div>
                </>}
            </>}
        </div>

        {connectWalletModal && <>
            <ConnectWalletModal onCancel={() => { setConnectWalletModal(false) }}></ConnectWalletModal>
        </>}
    </>;
};

export default MyNFT;
