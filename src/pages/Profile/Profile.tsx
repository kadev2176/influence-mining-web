import React, { useEffect, useState } from 'react';
import { useAccount, useNetwork, useContractRead, usePrepareContractWrite, useContractWrite } from 'wagmi';
import { useNavigate } from "react-router-dom";
import { Button, Card, Col, Image, notification, Row, Statistic, Typography } from 'antd';
import { Balance, getAd3Balance, getInfluence, getPoolSummary, Influence, PoolSummary, startMining, updateInfluence } from '../../services/mining.service';
import EIP5489ForInfluenceMining from '../../contracts/EIP5489ForInfluenceMining.json';
import { EIP5489ForInfluenceMiningContractAddress } from '../../models/parami';
import { BigNumber } from 'ethers';
import MintBillboard from '../../components/MintBillboard/MintBillboard';
import BillboardCommon from '../../components/BillboardCommon/BillboardCommon';
import './Profile.scss';
import AD3Balance from '../../components/AD3Balance/AD3Balance';
import InfluenceStat from '../../components/InfluenceStat/InfluenceStat';

const { Title } = Typography;

export interface ProfileProps { }

function Profile({ }: ProfileProps) {
    const { isConnected, address } = useAccount();
    const { chain } = useNetwork();
    const navigate = useNavigate();
    const [hnft, setHnft] = useState<any>(); // todo: type this
    const [influence, setInfluence] = useState<Influence | null>();

    const { data: nftBalance } = useContractRead<unknown[], string, BigNumber>({
        address: EIP5489ForInfluenceMiningContractAddress,
        abi: EIP5489ForInfluenceMining.abi,
        functionName: 'balanceOf',
        args: [address],
    });

    const { data: tokenId } = useContractRead<unknown[], string, BigNumber>({
        address: EIP5489ForInfluenceMiningContractAddress,
        abi: EIP5489ForInfluenceMining.abi,
        functionName: 'tokenOfOwnerByIndex',
        args: [address, 0],
    });

    const { data: tokenUri } = useContractRead<unknown[], string, string>({
        address: EIP5489ForInfluenceMiningContractAddress,
        abi: EIP5489ForInfluenceMining.abi,
        functionName: 'tokenURI',
        args: [tokenId],
    });

    useEffect(() => {
        if (tokenUri) {
            const token = JSON.parse(Buffer.from(tokenUri.slice(29), 'base64').toString())
            setHnft({
                ...token,
                tokenId: tokenId?.toString(),
                address: EIP5489ForInfluenceMiningContractAddress,
            })
        }
    }, [tokenUri])

    const refreshInfluenceStatus = async (address: string, chainId: number) => {
        getInfluence(address, chainId).then(res => {
            setInfluence(res);
        });
    }

    useEffect(() => {
        if (!isConnected) {
            navigate('/auth');
        }
    }, [isConnected])

    useEffect(() => {
        if (address) {
            refreshInfluenceStatus(address, chain!.id);
        }
    }, [address])

    useEffect(() => {
        if (influence) {
            updateInfluence(address!, chain!.id);
        }
    }, [influence])

    const handleStartMining = async () => {
        startMining(address!, chain!.id, hnft.address, hnft.tokenId).then(res => {
            notification.success({
                message: 'Mining Started!'
            })
            refreshInfluenceStatus(address!, chain!.id);
        })
    }

    return <>
        <div className='profile-container'>
            <MintBillboard influence={{} as Influence}></MintBillboard>
            {influence && <>
                {!nftBalance?.toNumber() && <>
                    <MintBillboard influence={influence}></MintBillboard>
                </>}

                {hnft && <>
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
                        {/* <div className='add-more'></div> */}
                    </div>

                    {(influence?.beginMiningTime && influence?.beginMiningTime > 0) && <>
                        <AD3Balance></AD3Balance>

                        <InfluenceStat influence={influence}></InfluenceStat>
                    </>}
                </>}
            </>}
        </div>
    </>;
};

export default Profile;
