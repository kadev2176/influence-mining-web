import { notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useLocation } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useHNFT } from '../../hooks/useHNFT';
import { useImAccount } from '../../hooks/useImAccount';
import BillboardNftImage from '../BillboardNftImage/BillboardNftImage';
import ConnectWalletModal from '../ConnectWalletModal/ConnectWalletModal';
import MintNFTModal from '../MintNFTModal/MintNFTModal';
import './MyNFT.scss';

export interface MyNFTProps { }

function MyNFT({ }: MyNFTProps) {
    const location = useLocation();
    const { isConnected } = useAccount();
    const [connectWalletModal, setConnectWalletModal] = useState<boolean>(false);
    const [mintNftModal, setMintNftModal] = useState<boolean>(false);
    const hnft = useHNFT();
    const { imAccount } = useImAccount();

    useEffect(() => {
        if (isConnected) {
            setConnectWalletModal(false);
        }
    }, [isConnected])

    return <>
        {location.pathname !== '/' && <>
            <div className='my-nft-container'>
                {!isConnected && <>
                    <div className='no-connect' onClick={() => {
                        setConnectWalletModal(true);
                    }}>
                        <span className='text'>
                            {isMobile ? 'Connect Wallet' : 'Connect wallet to view NFT'}
                        </span>
                    </div>
                </>}

                {isConnected && <>
                    {!hnft.balance && <>
                        <div className='no-hnft' onClick={() => {
                            notification.info({
                                message: 'Coming Soon'
                            })
                        }}>
                            <span className='text'>
                                {isMobile ? 'Mint HNFT' : 'Mint My HNFT'}
                            </span>
                        </div>
                    </>}

                    {!!hnft.balance && imAccount && <>
                        <div className='nft-container'>
                            <BillboardNftImage imageUrl={imAccount.twitterProfileImageUri} level={Number(hnft.level)} showTag={!isMobile}></BillboardNftImage>
                        </div>

                        {!isMobile && <>
                            <div className='action-btn-primary active' onClick={() => {
                                notification.info({
                                    message: 'Coming Soon'
                                })
                            }}>Upgrade HNFT</div>
                        </>}
                    </>}
                </>}
            </div>

            {connectWalletModal && <>
                <ConnectWalletModal onCancel={() => { setConnectWalletModal(false) }}></ConnectWalletModal>
            </>}

            {mintNftModal && <>
                <MintNFTModal onCancel={() => { setMintNftModal(false) }}></MintNFTModal>
            </>}
        </>}
    </>;
};

export default MyNFT;
