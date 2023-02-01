import React, { useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { notification, Typography } from 'antd';
import { startMining, updateInfluence } from '../../services/mining.service';
import BillboardCommon from '../../components/BillboardCommon/BillboardCommon';
import './Profile.scss';
import AD3Balance from '../../components/AD3Balance/AD3Balance';
import InfluenceStat from '../../components/InfluenceStat/InfluenceStat';
import { useInfluence } from '../../hooks/useInfluence';
import { useHNFT } from '../../hooks/useHNFT';

const { Title } = Typography;

export interface ProfileProps { }

function Profile({ }: ProfileProps) {
    const { address } = useAccount();
    const { chain } = useNetwork();
    const { influence, refresh } = useInfluence();
    const hnft = useHNFT();

    useEffect(() => {
        if (influence) {
            updateInfluence(address!, chain!.id);
        }
    }, [influence])

    const handleStartMining = async () => {
        startMining(address!, chain!.id, hnft.address!, hnft.tokenId!).then(res => {
            notification.success({
                message: 'Mining Started!'
            })

            refresh();
        })
    }

    return <>
        <div className='profile-container'>
            {!!hnft?.name && <>
                <div className='billboards'>
                    <div className='billboard-card'>
                        <BillboardCommon></BillboardCommon>

                        {(!influence?.beginMiningTime || influence?.beginMiningTime == 0) && <>
                            <div className='btn-container'>
                                <div className='btn active' onClick={handleStartMining}>
                                    Start Mining
                                </div>
                            </div>
                        </>}
                    </div>
                </div>
            </>}

            {influence && <>
                {!!influence?.beginMiningTime && <>
                    <AD3Balance></AD3Balance>

                    <InfluenceStat influence={influence}></InfluenceStat>
                </>}
            </>}
        </div>
    </>;
};

export default Profile;
