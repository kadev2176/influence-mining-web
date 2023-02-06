import React, { useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { notification, Typography } from 'antd';
import { startMining, updateInfluence } from '../../services/mining.service';
import BillboardCommon from '../../components/BillboardCommon/BillboardCommon';
import './Profile.scss';
import AD3Balance from '../../components/AD3Balance/AD3Balance';
import InfluenceStat from '../../components/InfluenceStat/InfluenceStat';
import { useHNFT } from '../../hooks/useHNFT';
import { useImAccount } from '../../hooks/useImAccount';

const { Title } = Typography;

export interface ProfileProps { }

function Profile({ }: ProfileProps) {
    const { address } = useAccount();
    const { chain } = useNetwork();
    const { imAccount, refresh, loading }  = useImAccount()
    const hnft = useHNFT();

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
        })
    }

    return <>
        <div className='profile-container'>
            {!!hnft?.name && <>
                <div className='billboards'>
                    <div className='billboard-card'>
                        <BillboardCommon></BillboardCommon>

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
