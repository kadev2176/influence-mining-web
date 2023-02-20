import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useImAccount } from '../../hooks/useImAccount';
import './HomePageHeader.scss';
import { LoadingOutlined } from '@ant-design/icons';

export interface HomePageHeaderProps { }

function HomePageHeader({ }: HomePageHeaderProps) {
    // const { open } = useWeb3Modal();
    const { address, isConnected } = useAccount();
    const [authModal, setAuthModal] = useState<boolean>();
    const navigate = useNavigate();
    const { imAccount, loading } = useImAccount();

    return <>
        <div className='header-container'>
            <div className='logo'>
            </div>
            <div className='connect-wallet'>
                {loading && <>
                    <div className='connect-btn action-btn'>
                        <LoadingOutlined spin />
                    </div>
                </>}

                {!loading && <>
                    {!!imAccount?.updatedTime && <>
                        <div className='user-profile' onClick={() => {
                            navigate('/vault');
                        }}>
                            <img src={imAccount.twitterProfileImageUri} referrerPolicy="no-referrer" className='pfp'></img>
                            <span className='wallet-address'>
                                {imAccount.wallet.slice(0, 8)}
                            </span>
                        </div>
                    </>}

                    {!imAccount?.updatedTime && !loading && <>
                        <div className='connect-btn action-btn active' onClick={() => {
                            navigate('/auth');
                        }}>
                            Join Now
                        </div>
                    </>}
                </>}
            </div>
        </div>
    </>;
};

export default HomePageHeader;
