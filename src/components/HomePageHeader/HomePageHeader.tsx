import { useWeb3Modal } from '@web3modal/react';
import { Button } from 'antd';
import React from 'react';
import { useAccount } from 'wagmi';
import './HomePageHeader.scss';

export interface HomePageHeaderProps { }

function HomePageHeader({ }: HomePageHeaderProps) {

    const { open } = useWeb3Modal();
    const { address, isConnected } = useAccount();


    return <>
        <div className='header-container'>
            <div className='logo'>
                <img className='logo-img' src='/assets/images/logo-core-colored.svg'></img>
                <span>Parami</span>
            </div>
            <div className='connect-wallet'>
                {!isConnected && <>
                    <Button className='connect-wallet-btn' type='primary' onClick={() => {
                        
                    }}>
                        <span>Connect Wallet</span>
                    </Button>
                </>}
            </div>
        </div>
    </>;
};

export default HomePageHeader;
