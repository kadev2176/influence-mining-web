import React, { useState } from 'react';
import { Typography, Button, Spin, Row, Col, Image } from 'antd';
import { PARAMI_WALLET } from '../../models/parami';
import { useHNFT } from '../../hooks/useHNFT';
import { useEffect } from 'react';
import { getActiveBidNftIds, getBillboardList, getNFTIdsOfOwnerDid } from '../../services/subquery.service';
import { useApiWs } from '../../hooks/useApiWs';
import { getAdIdOfNftId, getAvailableAd3BalanceOnParami, getParamiNftExternal } from '../../services/parami.service';
import { amountToFloatString } from '../../utils/format.util';
import { getIMAccountOfBillboard } from '../../services/mining.service';

const { Title } = Typography;

export interface BidWarProps { }

const openPopup = (url: string) => {
    window.open(url, 'Parami', 'popup,width=400,height=600');
}

function BidWar({ }: BidWarProps) {
    const hnft = useHNFT();
    const [did, setDid] = useState<string | null>(window.localStorage.getItem('did'));
    const [account, setAccount] = useState<string | null>(window.localStorage.getItem('account'));
    const [paramiNftId, setParamiNftId] = useState<string>();
    const [occupiedAdId, setOccupiedAdId] = useState<string>();
    const apiWs = useApiWs();
    const [nfts, setNfts] = useState<any[]>(); // todo: type this

    const [activeBidImAccounts, setActiveBidImAccounts] = useState<any[]>(); // todo: type this

    useEffect(() => {
        if (account && apiWs) {
            getAvailableAd3BalanceOnParami(account).then(res => {
                console.log('got parami ad3 balance', res);
            })
        }
    }, [account, apiWs])
    
    useEffect(() => {
        getBillboardList().then(list => {
            setNfts(list as any);
        })
    }, [])

    useEffect(() => {
        if (did && apiWs) {
            getNFTIdsOfOwnerDid(did).then(nftIds => {
                return nftIds ?? [];
            }).then(nftIds => {
                if (!nftIds.length) {
                    return []
                }

                return Promise.all(nftIds.map(nftId => getParamiNftExternal(nftId))).then(nfts => {
                    return nfts.map((nft, index) => {
                        return {
                            ...nft,
                            paramiNftId: nftIds[index]
                        }
                    })
                })
            }).then(externalNfts => {
                externalNfts.forEach((nft, index) => {
                    // mock
                    if (index === 0) {
                        setParamiNftId(nft.paramiNftId);
                        return;
                    }

                    if (nft && nft.tokenId === hnft.tokenId && nft.address?.toLowerCase() === hnft.address?.toLowerCase()) {
                        setParamiNftId(nft.paramiNftId);
                    }
                })
            })
        }
    }, [did, apiWs])

    useEffect(() => {
        if (paramiNftId) {
            getAdIdOfNftId(paramiNftId).then(adId => {
                if (adId) {
                    setOccupiedAdId(adId);
                }
            })

            getActiveBidNftIds(did!).then(nftIds => {
                if (!(nftIds as any)?.length) {
                    return [];
                }

                return Promise.all((nftIds as string[]).map(nftId => {
                    return getParamiNftExternal(nftId);
                }))
            }).then(nfts => {
                if (!nfts?.length) {
                    return [];
                }

                return Promise.all(nfts.map(nft => {
                    if (!nft?.address || !nft.tokenId) {
                        return null;
                    }
                    return getIMAccountOfBillboard(nft?.address, nft?.tokenId)
                }))
            }).then(imAccounts => {
                setActiveBidImAccounts(imAccounts);
            })
        }
    }, [paramiNftId])

    return <>
        <Title level={3}>Bid War</Title>
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

                                    // todo: if event import nft success
                                }
                            })
                        }}
                    >Enlist Now</Button>
                </div>
            </>}

            {hnft && !!paramiNftId && <>
                <Title level={4}>War is on!</Title>
                <Title level={5}>Bid on others and hijack their influence power!</Title>
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
            <Spin spinning={!activeBidImAccounts}>
                {activeBidImAccounts && activeBidImAccounts.length === 0 && <>
                    <Title level={5}>You are not occuping any billboards</Title>
                </>}
                {activeBidImAccounts && activeBidImAccounts.length > 0 && <>
                    <Row gutter={20}>
                        {activeBidImAccounts.map((imAccount, index) => {
                            // todo: use imAccount.xx as key
                            return <Col xl={6} lg={6} md={24} sm={24} xs={24} key={index}>
                                <div className='nft-card'>
                                    <div>
                                        <Image src={imAccount.nftImage}></Image>
                                    </div>
                                    <div>Influence hijacked: {imAccount.influence}</div>
                                    <div>Current price: xxx AD3</div>
                                </div>
                            </Col>
                        })}
                    </Row>
                </>}
            </Spin>

            <Row>
                <Col>
                    <Title level={4}>
                        List of billboards (you can bid)
                    </Title>
                    <Spin spinning={!nfts}>
                        {nfts?.length === 0 && <>
                            No avaiable billboards at the moment.
                        </>}

                        <Row gutter={12}>
                            {nfts && nfts.length > 0 && <>
                                {nfts.map(nft => {
                                    return <Col xl={12} lg={12} md={24} sm={24} xs={24} key={nft.nftId}>
                                        <div className='nft-card'>
                                            <div>
                                                <Image src={nft.imageUrl}></Image>
                                            </div>
                                            <div>Influence: {nft.influence}</div>
                                            <div>Price: {amountToFloatString(nft.price)} AD3</div>
                                            <div className='btn-container'>
                                                <Button type='primary' onClick={() => {
                                                    openPopup(`${PARAMI_WALLET}/quickBid/${nft.nftId}/${nft.price}`);
                                                    window.addEventListener('message', (event) => {
                                                        if (event.origin === PARAMI_WALLET) {
                                                            // todo: if event bid success
                                                        }
                                                    })
                                                }}>Hijack</Button>
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
