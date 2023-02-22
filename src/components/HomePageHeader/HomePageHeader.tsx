import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAccount, useNetwork } from 'wagmi';
import { useImAccount } from '../../hooks/useImAccount';
import './HomePageHeader.scss';
import { LoadingOutlined } from '@ant-design/icons';
import { updateInfluence } from '../../services/mining.service';

export interface HomePageHeaderProps { }

function HomePageHeader({ }: HomePageHeaderProps) {
    const { address } = useAccount();
    const { chain } = useNetwork();
    const navigate = useNavigate();
    const { imAccount, loading } = useImAccount();
    const location = useLocation();

    useEffect(() => {
        if (imAccount) {
            updateInfluence(address!, chain!.id);
        }
    }, [imAccount])

    return <>
        <div className='header-container'>
            <div className='logo'>
            </div>
            <div className='connect-wallet'>
                {location.pathname !== '/vault' && <>
                    <div className='connect-btn action-btn active' onClick={() => {
                        navigate('/auth');
                    }}>
                        Laucn App
                    </div>
                </>}

                {location.pathname === '/vault' && <>
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
                    </>}
                </>}
            </div>
        </div>
    </>;
};

export default HomePageHeader;
