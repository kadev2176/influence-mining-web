import React, { useEffect, useState } from 'react';
import { useAccount, useNetwork, useContractRead, usePrepareContractWrite, useContractWrite } from 'wagmi';
import { useNavigate } from "react-router-dom";
import { Button, Card, Col, Image, notification, Row, Statistic, Typography } from 'antd';
import { Balance, getAd3Balance, getInfluence, getPoolSummary, Influence, PoolSummary, startMining } from '../../services/mining.service';
import EIP5489ForInfluenceMining from '../../contracts/EIP5489ForInfluenceMining.json';
import { EIP5489ForInfluenceMiningContractAddress } from '../../models/parami';
import { BigNumber } from 'ethers';

const { Title } = Typography;

export interface ProfileProps { }

function Profile({ }: ProfileProps) {
    const { isConnected, address } = useAccount();
    const { chain } = useNetwork();
    const navigate = useNavigate();
    const [hnft, setHnft] = useState<any>(); // todo: type this
    const [ad3Balance, setAd3Balance] = useState<Balance>();
    const [influence, setInfluence] = useState<Influence | null>();
    const [poolSummary, setPoolSummary] = useState<PoolSummary>();

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
        getPoolSummary().then(summary => {
            setPoolSummary(summary);
        })
    }, [])

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

    const { config } = usePrepareContractWrite({
        address: EIP5489ForInfluenceMiningContractAddress,
        abi: EIP5489ForInfluenceMining.abi,
        functionName: 'mint',
        args: ['https://pbs.twimg.com/profile_images/1611305582367215616/4W9XpGpU_200x200.jpg']
    });
    const { data, isLoading, isSuccess, write: mint } = useContractWrite(config);

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
            getAd3Balance(address).then(res => {
                setAd3Balance(res);
            });

            refreshInfluenceStatus(address, chain!.id);
        }
    }, [address])

    const handleStartMining = async () => {
        startMining(address!, chain!.id, hnft.address, hnft.tokenId).then(res => {
            notification.success({
                message: 'Mining Started!'
            })
            refreshInfluenceStatus(address!, chain!.id);
        })
    }

    return <>
        <div>
            {!nftBalance?.toNumber() && <>
                <Title level={3}>Choose Your Billboard</Title>
                <Card title="Common NFT Billboard" style={{ width: '100%', marginBottom: '20px' }}>
                    <div><b>1X</b> mining speed</div>
                    <p>Free Mint</p>
                    <Button type='primary' onClick={() => {
                        mint?.();
                    }}>Mint Your Billboard</Button>
                </Card>

                <Card title="Rare NFT Billboard" style={{ width: '100%', marginBottom: '20px' }}>
                    <div><b>1.4X</b> mining speed</div>
                    <p>price: 10 AD3</p>
                    <Button type='primary' disabled>Coming Soon</Button>
                </Card>

                <Card title="Epic NFT Billboard" style={{ width: '100%' }}>
                    <div><b>1.8X</b> mining speed</div>
                    <p>price: 50 AD3</p>
                    <Button type='primary' disabled>Coming Soon</Button>
                </Card>
            </>}

            {hnft && <>
                <div>
                    <Image src={hnft.image} referrerPolicy='no-referrer'></Image>
                </div>
                {(influence?.beginMiningTime && influence?.beginMiningTime > 0) && <>
                    {ad3Balance && <>
                        <Title level={3}>AD3 Balance</Title>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Statistic title="Total:" value={`${ad3Balance.total}`} />
                            </Col>
                            <Col span={8}>
                                <Statistic title="Withdrawable" value={`${ad3Balance.withdrawable}`} precision={2} />
                            </Col>
                            <Col span={8}>
                                <Statistic title="Locked" value={`${ad3Balance.locked}`} />
                            </Col>
                        </Row>
                    </>}

                    {influence && <>
                        <Title level={3}>Your Social Influence</Title>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Statistic title="Social Influence:" value={`${influence.influence}`} />
                            </Col>
                            <Col span={8}>
                                <Statistic title="Total Influence:" value={`${poolSummary?.totalInfluence}`} />
                            </Col>
                            <Col span={8}>
                                <Statistic title="Total Daily Reward:" value={`${poolSummary?.currentDailyOutput}`} />
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Statistic title="Referral Count:" value={`${influence.accountReferalCount}`} />
                            </Col>
                            <Col span={8}>
                                <Statistic title="Extension Referral Count:" value={`${influence.pluginReferalCount}`} />
                            </Col>
                            {/* <Col span={8}>
                                <Statistic title="Total Daily Reward:" value={`${poolSummary?.currentDailyOutput}`} />
                            </Col> */}
                        </Row>
                    </>}
                </>}

                {(!influence?.beginMiningTime || influence?.beginMiningTime == 0) && <>
                    <div style={{ marginTop: '20px' }}>
                        <Button type='primary' onClick={handleStartMining}>Start Influence Mining</Button>
                    </div>
                </>}
            </>}
        </div>
    </>;
};

export default Profile;
