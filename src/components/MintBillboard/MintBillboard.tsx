import React, { useEffect, useState } from 'react';
import { Col, Row, Typography, Spin, notification } from 'antd';
import './MintBillboard.scss';
import BillboardCommon from '../BillboardCommon/BillboardCommon';
import { useHNFT } from '../../hooks/useHNFT';
import { useInfluence } from '../../hooks/useInfluence';
import { useMintBillboard } from '../../hooks/useMintBillboard';
import { useUpgradeBillboard } from '../../hooks/useUpgradeBillboard';
import { useBillboardPrices } from '../../hooks/useBillboardPrices';
import { BigNumber } from 'ethers';
import { useApproveAD3 } from '../../hooks/useApproveAD3';

const { Title } = Typography;

const BillboardOptions = [
    {
        level: 0,
        name: 'Common Billboard',
        description: 'Entry level billboard. Monetize your social influence for free.',
        price: 'Free',
    },
    {
        level: 1,
        name: 'Uncommon Billboard',
        description: 'Earn AD3 1.2x faster with this uncommon billboard.',
        price: '50 AD3'
    },
    {
        level: 2,
        name: 'Rare Billboard',
        description: 'Earn AD3 1.4x faster with this rare billboard.',
        price: '100 AD3'
    },
    {
        level: 3,
        name: 'Epic Billboard',
        description: 'Earn AD3 1.6x faster with this epic billboard.',
        price: '150 AD3'
    },
    {
        level: 4,
        name: 'Legendary Billboard',
        description: 'Earn AD3 1.8x faster with this epic billboard.',
        price: '200 AD3'
    }
]

function MintBillboard() {
    const [mintLevel, setMintLevel] = useState<number>();
    const [upgradeToLevel, setUpgradeToLevel] = useState<number>();
    const [price, setPrice] = useState<string>();
    const hnft = useHNFT();
    const { influence } = useInfluence();
    const { mint, isSuccess: mintSuccess, isLoading: mintLoading, isError: mintError } = useMintBillboard(mintLevel, influence?.twitterProfileImageUri ?? ''); // default image?
    const { upgradeBillboardLevel, isSuccess: upgradeSuccess, isLoading: upgradeLoading, isError: upgradeError } = useUpgradeBillboard(hnft.tokenId, upgradeToLevel);
    const { approve, isLoading: approveLoading, isSuccess: approveSuccess, isError: approveError } = useApproveAD3(price);

    const clearState = () => {
        setMintLevel(undefined);
        setUpgradeToLevel(undefined);
        setPrice(undefined);
    }

    useEffect(() => {
        if (approveError || mintError || upgradeError) {
            clearState();
        }
    }, [approveError, mintError, upgradeError])

    const prices = useBillboardPrices();

    useEffect(() => {
        if (mintSuccess || upgradeSuccess) {
            window.location.reload();
        }
    }, [mintSuccess, upgradeSuccess]);

    useEffect(() => {
        if (upgradeToLevel !== undefined) {
            const priceDiff = BigNumber.from(prices[upgradeToLevel]).sub(prices[hnft.level!]).toString();
            setPrice(priceDiff);
        }
    }, [upgradeToLevel])

    useEffect(() => {
        if (price && approve) {
            approve();
        }
    }, [price])

    useEffect(() => {
        if (upgradeToLevel !== undefined && upgradeBillboardLevel && approveSuccess) {
            upgradeBillboardLevel();
        }
    }, [upgradeToLevel, approveSuccess]);

    useEffect(() => {
        if (mintLevel !== undefined) {
            const price = prices[mintLevel];
            if (Number(price) > 0) {
                setPrice(price);
            } else {
                mint?.();
            }
        }
    }, [mintLevel])

    useEffect(() => {
        if (mintLevel !== undefined && mint && approveSuccess) {
            mint();
        }
    }, [mintLevel, approveSuccess]);

    const billboards = BillboardOptions.map(billboard => {
        return <>
            <Col xl={12} lg={12} md={24} sm={24} xs={24} key={billboard.name}>
                <div className='nft-card'>
                    <div className='content-container'>
                        <div className='billboard'>
                            <BillboardCommon />
                        </div>

                        <div className='info-container'>
                            <div className='info'>
                                <div className='description'>
                                    {billboard.description}
                                </div>
                            </div>
                            <div className='price'>
                                <div className='price-title'>Price:</div>
                                <div className='price-value'>
                                    {Number(prices[billboard.level]) > 0 && <>
                                        {prices[billboard.level]} AD3
                                    </>}
                                    {Number(prices[billboard.level]) === 0 && <>
                                        Free
                                    </>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='btn-container'>
                        {hnft?.balance === 0 && <>
                            <div className='btn active' onClick={() => {
                                setMintLevel(billboard.level);
                            }}>Mint</div>
                        </>}
                        {!!hnft?.balance && hnft?.balance > 0 && <>
                            {hnft.level! >= billboard.level && <>
                                <div className='btn disabled'>Owned</div>
                            </>}
                            {hnft.level! < billboard.level && <>
                                <div className='btn active' onClick={() => {
                                    setUpgradeToLevel(billboard.level);
                                }}>Upgrade</div>
                            </>}
                        </>}
                    </div>
                </div>
            </Col>
        </>
    });

    return <>
        <Spin spinning={mintLoading || upgradeLoading || approveLoading}>
            <div className='mint-billboard-container'>
                <Title level={3} className='title'>Choose Your Billboard</Title>

                <Row gutter={12}>
                    {billboards}
                </Row>
            </div>
        </Spin>
    </>;
};

export default MintBillboard;
