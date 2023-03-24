import { useWeb3Modal } from '@web3modal/react';
import { Modal, notification } from 'antd';
import React, { useEffect } from 'react';
import { useConnect } from 'wagmi';
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

    return <>
        <Modal
            className='connect-wallet-modal'
            open
            title=""
            onCancel={() => { onCancel() }}
            footer={null}
            width={950}
            centered
        >
            <div className='connect-wallet-container'>
                <div className='title'>Connect Wallet</div>
                <div className='connect-btns'>
                    <div className='connect-btn' onClick={() => {
                        connect({ connector: connectors[0] })
                    }}>
                        <img src="/logo/logo_metamask.png" className='logo'></img>
                        MetaMask
                    </div>
                    <div className='connect-btn' onClick={() => {
                        open()
                    }}>
                        <img src="/logo/logo_walletconnect.png" className='logo'></img>
                        WalletConnect
                    </div>
                </div>
            </div>
        </Modal>
    </>;
};

export default ConnectWalletModal;
