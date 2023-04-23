import React, { useEffect, useState } from 'react';
import { Col, Row, Typography, Spin, notification } from 'antd';
import './MintBillboard.scss';
import { useHNFT } from '../../hooks/useHNFT';
import { useMintBillboard } from '../../hooks/useMintBillboard';
import { useUpgradeBillboard } from '../../hooks/useUpgradeBillboard';
import { useBillboardPrices } from '../../hooks/useBillboardPrices';
import { BigNumber } from 'ethers';
import { useApproveAD3 } from '../../hooks/useApproveAD3';
import { formatAd3Amount } from '../../utils/format.util';
import { useImAccount } from '../../hooks/useImAccount';
import BillboardNftImage from '../BillboardNftImage/BillboardNftImage';

const { Title } = Typography;

const BillboardOptions = [
    {
        level: 0,
        name: 'Common Billboard',
        description: 'Entry level billboard. Monetize your social influence for free.',
    },
    {
        level: 1,
        name: 'Uncommon Billboard',
        description: 'Earn AD3 1.2x faster with this uncommon billboard.',
    },
    {
        level: 2,
        name: 'Rare Billboard',
        description: 'Earn AD3 1.4x faster with this rare billboard.',
    },
    {
        level: 3,
        name: 'Epic Billboard',
        description: 'Earn AD3 1.6x faster with this epic billboard.',
    },
    {
        level: 4,
        name: 'Legendary Billboard',
        description: 'Earn AD3 1.8x faster with this epic billboard.',
    }
]

function MintBillboard() {
    const [mintLevel, setMintLevel] = useState<number>();
    const [upgradeToLevel, setUpgradeToLevel] = useState<number>();
    const [price, setPrice] = useState<string>();
    const hnft = useHNFT();
    const { imAccount } = useImAccount();
    const { mint, isSuccess: mintSuccess, isLoading: mintLoading, error: mintError } = useMintBillboard(mintLevel, imAccount?.twitterProfileImageUri ?? ''); // default image?
    const { upgradeHnft, isSuccess: upgradeSuccess, isLoading: upgradeLoading, error: upgradeError } = useUpgradeBillboard(hnft.tokenId, upgradeToLevel);
    const { approve, isLoading: approveLoading, isSuccess: approveSuccess, error: approveError } = useApproveAD3(price);

    const clearState = () => {
        setMintLevel(undefined);
        setUpgradeToLevel(undefined);
        setPrice(undefined);
    }

    useEffect(() => {
        if (approveError || mintError || upgradeError) {
            clearState();
            notification.warning({
                message: approveError?.message || mintError?.message || upgradeError?.message
            });
        }
    }, [approveError, mintError, upgradeError]);

    const prices = useBillboardPrices();

    useEffect(() => {
        if (mintSuccess || upgradeSuccess) {
            window.location.reload();
        }
    }, [mintSuccess, upgradeSuccess]);

    useEffect(() => {
        if (upgradeToLevel !== undefined) {
            const priceDiff = BigNumber.from(prices[upgradeToLevel]).sub(prices[Number(hnft.level!)]).toString();
            setPrice(priceDiff);
        }
    }, [upgradeToLevel])

    useEffect(() => {
        if (price && approve) {
            approve();
        }
    }, [price])

    useEffect(() => {
        if (upgradeToLevel !== undefined && upgradeHnft && approveSuccess) {
            upgradeHnft();
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
                <div className='nft-card-border'>
                    <div className='nft-card'>
                        <div className='content-container'>
                            <div className='billboard'>
                                <BillboardNftImage imageUrl={imAccount?.twitterProfileImageUri ?? ''} level={billboard.level}></BillboardNftImage>
                            </div>

                            <div className='info-container'>
                                <div className='title'>
                                    {billboard.name}
                                </div>
                                <div className='description'>
                                    {billboard.description}
                                </div>
                                <div className='price'>
                                    <div className='icon'>
                                        <i className="fa-brands fa-ethereum"></i>
                                    </div>
                                    <div className='value'>{0.3}</div>
                                    {/* <div className='price-title'>Price:</div>
                                <div className='price-value'>
                                    {Number(prices[billboard.level]) > 0 && <>
                                        {formatAd3Amount(prices[billboard.level])} AD3
                                    </>}
                                    {Number(prices[billboard.level]) === 0 && <>
                                        Free
                                    </>}
                                </div> */}
                                </div>
                            </div>

                            <div className='btn-container'>
                                <div className='mint-btn'>Mint</div>
                            </div>
                        </div>

                        {/* <div className='btn-container'>
                        {hnft?.balance === 0 && <>
                            <div className='btn active' onClick={() => {
                                console.log('mint:', billboard.level);
                                setMintLevel(billboard.level);
                            }}>Mint</div>
                        </>}
                        {!!hnft?.balance && hnft?.balance > 0 && <>
                            {Number(hnft.level!) >= billboard.level && <>
                                <div className='btn disabled'>Owned</div>
                            </>}
                            {Number(hnft.level!) < billboard.level && <>
                                <div className='btn active' onClick={() => {
                                    setUpgradeToLevel(billboard.level);
                                }}>Upgrade</div>
                            </>}
                        </>}
                    </div> */}
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
