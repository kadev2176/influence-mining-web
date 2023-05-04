import { notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAccount, useNetwork } from 'wagmi';
import { useHNFT } from '../../hooks/useHNFT';
import { useImAccount } from '../../hooks/useImAccount';
import BillboardNftImage from '../BillboardNftImage/BillboardNftImage';
import ConnectWalletModal from '../ConnectWalletModal/ConnectWalletModal';
import './MyNFT.scss';
import { accountBindWallet } from '../../services/mining.service';

export interface MyNFTProps { }

function MyNFT({ }: MyNFTProps) {
    const location = useLocation();
    const { isConnected } = useAccount();
    const { address } = useAccount();
    const { chain } = useNetwork();
    const [connectWalletModal, setConnectWalletModal] = useState<boolean>(false);
    const hnft = useHNFT();
    const { imAccount, refresh } = useImAccount();
    const navigate = useNavigate();

    useEffect(() => {
        if (imAccount && !imAccount.wallet && address && chain) {
            accountBindWallet(address, chain.id).then(res => {
                if (res.success) {
                    refresh();
                }
            })
        }
    }, [imAccount, address, chain]);

    useEffect(() => {
        if (isConnected) {
            setConnectWalletModal(false);
        }
    }, [isConnected])

    return <>
        {(location.pathname !== '/' && location.pathname !== '/mint') && <>
            <div className={`my-nft-container ${location.pathname === '/leaderboard' ? 'high-position' : ''}`}>
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
                            navigate('/mint');
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
                                navigate('/mint');
                            }}>Upgrade HNFT</div>
                        </>}
                    </>}
                </>}
            </div>

            {connectWalletModal && <>
                <ConnectWalletModal onCancel={() => { setConnectWalletModal(false) }}></ConnectWalletModal>
            </>}
        </>}
    </>;
};

export default MyNFT;
