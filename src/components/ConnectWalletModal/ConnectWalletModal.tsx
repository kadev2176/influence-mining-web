import { useWeb3Modal } from '@web3modal/react';
import { Modal, notification } from 'antd';
import React, { useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { useConnect } from 'wagmi';
import MobileDrawer from '../MobileDrawer/MobileDrawer';
import './ConnectWalletModal.scss';

export interface ConnectWalletModalProps {
    onCancel: () => void;
}

function ConnectWalletModal({ onCancel }: ConnectWalletModalProps) {
    const { connect, connectors, error } = useConnect();
    const { open } = useWeb3Modal();

    useEffect(() => {
        if (error) {
            notification.error({
                message: error.message
            })
        }
    }, [error])

    const content = <>
        <div className='title'>Connect Wallet</div>
        <div className='connect-btns'>
            {!isMobile && <>
                <div className='connect-btn' onClick={() => {
                    connect({ connector: connectors[0] })
                }}>
                    <img src="/logo/logo_metamask.png" className='logo'></img>
                    MetaMask
                </div>
            </>}
            <div className='connect-btn' onClick={() => {
                open()
            }}>
                <img src="/logo/logo_walletconnect.png" className='logo'></img>
                WalletConnect
            </div>
        </div>
    </>

    return <>
        {!isMobile && <>
            <Modal
                className='connect-wallet-modal'
                open
                title=""
                onCancel={() => { onCancel() }}
                footer={null}
                width={956}
                centered
            >
                <div className='connect-wallet-container'>
                    {content}
                </div>
            </Modal>
        </>}

        {isMobile && <>
            <MobileDrawer closable onClose={onCancel}>
                <div className='connect-wallet-drawer'>
                    {content}
                </div>
            </MobileDrawer>
        </>}
    </>;
};

export default ConnectWalletModal;
