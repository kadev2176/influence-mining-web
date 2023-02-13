import React, { useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { Button, notification, Typography } from 'antd';
import { startMining, updateInfluence } from '../../services/mining.service';
import './Profile.scss';
import AD3Balance from '../../components/AD3Balance/AD3Balance';
import InfluenceStat from '../../components/InfluenceStat/InfluenceStat';
import { useHNFT } from '../../hooks/useHNFT';
import { useImAccount } from '../../hooks/useImAccount';
import BillboardNftImage from '../../components/BillboardNftImage/BillboardNftImage';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

export interface ProfileProps { }

function Profile({ }: ProfileProps) {
    const { address } = useAccount();
    const { chain } = useNetwork();
    const { imAccount, refresh, loading } = useImAccount()
    const hnft = useHNFT();
    const navigate = useNavigate();

    useEffect(() => {
        if (imAccount) {
            updateInfluence(address!, chain!.id);
        }
    }, [imAccount])

    const handleStartMining = async () => {
        startMining(address!, chain!.id, hnft.address!, hnft.tokenId!).then(res => {
            notification.success({
                message: 'Mining Started!'
            })
            refresh();
        }).catch((e) => {
            console.log(e);
            notification.warning({
                message: 'Network Error. Please try again later.'
            })
        })
    }

    return <>
        <div className='profile-container'>
            <Title level={3}>Billboard</Title>
            {!hnft?.balance && <>
                <Button type="primary" onClick={() => {
                    navigate('/market');
                }}>Mint Your Billboard</Button>
            </>}

            {!!hnft?.name && <>
                <div className='billboards'>
                    <div className='billboard-card'>
                        <div className='billboard-nft'>
                            <BillboardNftImage imageUrl={imAccount?.twitterProfileImageUri ?? ''}></BillboardNftImage>
                        </div>
                        <div className='prop'>
                            <div className='label'>Name:</div>
                            <div className='value'>{hnft.name}</div>
                        </div>
                        <div className='prop'>
                            <div className='label'>Level:</div>
                            <div className='value'>{hnft.levelName}</div>
                        </div>
                        <div className='prop'>
                            <div className='label'>Mining Power:</div>
                            <div className='value'>x {hnft.miningPower}</div>
                        </div>


                        {(!imAccount?.beginMiningTime || imAccount?.beginMiningTime == 0) && <>
                            <div className='btn-container'>
                                <div className='btn active' onClick={handleStartMining}>
                                    Start Mining
                                </div>
                            </div>
                        </>}
                    </div>
                </div>
            </>}

            {imAccount && <>
                {!!imAccount?.beginMiningTime && <>
                    <AD3Balance></AD3Balance>

                    <InfluenceStat influence={imAccount}></InfluenceStat>
                </>}
            </>}
        </div>
    </>;
};

export default Profile;
