import React, { useState } from 'react';
import { Typography, Button, Spin, Row, Col, Image, notification } from 'antd';
import { PARAMI_WALLET, POST_MESSAGE } from '../../models/parami';
import { useHNFT } from '../../hooks/useHNFT';
import { useEffect } from 'react';
import { useApiWs } from '../../hooks/useApiWs';
import { getActiveBidNftIdsOfDid, getAdSlotOfNftId, getAvailableAd3BalanceOnParami, getCurrentPriceOfNftId, getParamiNftExternal, getPortedNftIdOfHnft } from '../../services/parami.service';
import { amountToFloatString, formatTwitterImageUrl } from '../../utils/format.util';
import { useAccount, useNetwork } from 'wagmi';
import { useImAccount } from '../../hooks/useImAccount';
import { getIMAccountOfBillboard, getImAccountsReadyForBid, startPreempt } from '../../services/mining.service';
import { openPopup } from '../../utils/window.util';

const { Title } = Typography;

export interface BidWarProps { }

interface Billboard {
    paramiNftId: string;
    influence: number;
    nftImage: string;
    price: string;
}

function BidWar({ }: BidWarProps) {
    const { address } = useAccount();
    const { chain } = useNetwork();
    const hnft = useHNFT();
    const [did, setDid] = useState<string | null>(window.localStorage.getItem('did'));
    const [account, setAccount] = useState<string | null>(window.localStorage.getItem('account'));
    const [paramiNftId, setParamiNftId] = useState<string>();
    const [occupiedAdId, setOccupiedAdId] = useState<string>();
    const apiWs = useApiWs();
    const [availableBillboards, setAvailableBillboards] = useState<Billboard[]>();
    const { imAccount, refresh } = useImAccount();
    const [activeBidBillboards, setActiveBidBillboards] = useState<Billboard[]>();

    useEffect(() => {
        if (account && apiWs) {
            getAvailableAd3BalanceOnParami(account).then(res => {
                console.log('got parami ad3 balance', res);
            })
        }
    }, [account, apiWs])

    const fetchAvailableBillboards = async (address: string, chainId: number) => {
        const imAccounts = await getImAccountsReadyForBid(address, chainId) ?? [];
        const portedNftIds = await Promise.all(imAccounts.map(imAccount => {
            return getPortedNftIdOfHnft(imAccount.hnftContractAddr, imAccount.hnftTokenId);
        }));
        const balances = await Promise.all(portedNftIds.map(nftId => {
            if (!nftId) {
                return '0';
            }
            return getCurrentPriceOfNftId(nftId);
        }));

        const billboards = imAccounts.map((imAccount, index) => {
            const billboard: Billboard = {
                paramiNftId: portedNftIds[index] ?? '',
                influence: imAccount.influence,
                nftImage: formatTwitterImageUrl(imAccount.twitterProfileImageUri),
                price: balances[index] ?? ''
            }
            return billboard;
        });
        
        setAvailableBillboards(billboards);
    }

    useEffect(() => {
        if (address && chain && apiWs) {
            fetchAvailableBillboards(address, chain.id);
        }
    }, [address, chain, apiWs]);

    useEffect(() => {
        if (apiWs && hnft.address && hnft.tokenId) {
            getPortedNftIdOfHnft(hnft.address, hnft.tokenId).then(nftId => {
                if (nftId) {
                    setParamiNftId(nftId);
                }
            })
        }
    }, [apiWs, hnft]);

    const queryActiveBidImAccounts = async (did: string) => {
        const activeBidNftIds = await getActiveBidNftIdsOfDid(did);
        const paramiExternalNfts = await Promise.all(activeBidNftIds.map(nftId => {
            return getParamiNftExternal(nftId);
        }));

        const imAccounts = await Promise.all(paramiExternalNfts.map(nft => {
            if (!nft) {
                return null;
            }
            return getIMAccountOfBillboard(address!, nft.address, nft.tokenId);
        }));

        const balances = await Promise.all(activeBidNftIds.map(nftId => getCurrentPriceOfNftId(nftId)))

        const activeBidBillboards = activeBidNftIds.map((nftId, index) => {
            if (!imAccounts[index]) {
                return null;
            }
            return {
                paramiNftId: nftId,
                influence: (imAccounts[index])?.influence ?? 0,
                nftImage: formatTwitterImageUrl((imAccounts[index])?.twitterProfileImageUri),
                price: balances[index] ?? '0'
            }
        }).filter(Boolean) as Billboard[];

        setActiveBidBillboards(activeBidBillboards);
    }

    useEffect(() => {
        if (paramiNftId) {
            getAdSlotOfNftId(paramiNftId).then(slot => {
                if (slot?.adId) {
                    setOccupiedAdId(slot?.adId);
                }
            })

            queryActiveBidImAccounts(did!);
        }
    }, [paramiNftId]);

    return <>
    {/* <div>
        <Button type='primary' onClick={() => {
            testGraphQL()
        }}>Test</Button>
    </div> */}
        <Title level={3}>Billboard Steal</Title>
        <Spin spinning={!hnft}>
            {hnft && !paramiNftId && <>
                <Title level={4}>You haven't enlisted</Title>
                <div className='btn-container'>
                    <Button type='primary'
                        onClick={() => {
                            openPopup(`${PARAMI_WALLET}/enlist/${hnft.address}/${hnft.tokenId}`);
                            window.addEventListener('message', (event) => {
                                if (event.origin === PARAMI_WALLET) {
                                    if (event.data.startsWith('did:')) {
                                        const did = event.data.slice(4);
                                        window.localStorage.setItem('did', did)
                                        setDid(did);
                                    }

                                    if (event.data.startsWith('account:')) {
                                        const account = event.data.slice(8);
                                        window.localStorage.setItem('account', account);
                                        setAccount(account);
                                    }

                                    if (event.data === POST_MESSAGE.NFT_IMPORTED) {
                                        // refresh
                                        notification.success({
                                            message: 'NFT IMPORT SUCCESS!'
                                        })
                                    }
                                }
                            })
                        }}
                    >Enlist Now</Button>
                </div>
            </>}

            {hnft && !!paramiNftId && <>
                <Title level={4}>War is on!</Title>
                <Title level={5}>Bid on others and steal their influence power!</Title>
                <Row>
                    {imAccount && !imAccount.beginPreemptTime && <>
                        <Button type='primary' onClick={async () => {
                            const res = await startPreempt(address!, chain!.id);
                            if (res.success) {
                                notification.success({
                                    message: 'Start Success'
                                })
                                refresh();
                            }
                        }}>Start War</Button>
                    </>}
                </Row>

                <Row>
                    {occupiedAdId && <>
                        <Col>
                            <div>Your influence power has been hijacked!</div>
                            <Button type='primary' onClick={() => {
                                // open bid window
                            }}>Take it back</Button>
                        </Col>
                    </>}
                </Row>
            </>}

            <Title level={4}>Active Bids</Title>
            <Spin spinning={!activeBidBillboards}>
                {activeBidBillboards && activeBidBillboards.length === 0 && <>
                    <Title level={5}>You are not occuping any billboards</Title>
                </>}
                {activeBidBillboards && activeBidBillboards.length > 0 && <>
                    <Row gutter={20}>
                        {activeBidBillboards.map((billboard, index) => {
                            return <Col xl={6} lg={6} md={24} sm={24} xs={24} key={billboard.paramiNftId}>
                                <div className='nft-card'>
                                    <div>
                                        <Image src={billboard.nftImage} referrerPolicy={'no-referrer'}></Image>
                                    </div>
                                    <div>Influence hijacked: {billboard.influence}</div>
                                    <div>Current price: {amountToFloatString(billboard.price)} AD3</div>
                                </div>
                            </Col>
                        })}
                    </Row>
                </>}
            </Spin>

            <Row>
                <Col>
                    <Title level={4}>
                        List of billboards you can steal
                    </Title>
                    <Spin spinning={!availableBillboards}>
                        {availableBillboards?.length === 0 && <>
                            No avaiable billboards at the moment.
                        </>}

                        <Row gutter={12}>
                            {availableBillboards && availableBillboards.length > 0 && <>
                                {availableBillboards.map(billboard => {
                                    return <Col xl={12} lg={12} md={24} sm={24} xs={24} key={billboard.paramiNftId}>
                                        <div className='nft-card'>
                                            <div>
                                                <Image src={billboard.nftImage}></Image>
                                            </div>
                                            <div>Influence: {billboard.influence}</div>
                                            {/* higher than current price */}
                                            <div>Price: {amountToFloatString(billboard.price)} AD3</div>
                                            <div className='btn-container'>
                                                <Button type='primary' onClick={() => {
                                                    openPopup(`${PARAMI_WALLET}/quickBid/${billboard.paramiNftId}/${billboard.price}`);
                                                    window.addEventListener('message', (event) => {
                                                        if (event.origin === PARAMI_WALLET) {
                                                            if (event.data === POST_MESSAGE.AD_BID) {
                                                                // refresh?
                                                                notification.success({
                                                                    message: 'Bid Success'
                                                                })
                                                            }
                                                        }
                                                    })
                                                }}>Steal</Button>
                                            </div>
                                        </div>
                                    </Col>
                                })}
                            </>}
                        </Row>
                    </Spin>
                </Col>
            </Row>
        </Spin>
    </>;
};

export default BidWar;
