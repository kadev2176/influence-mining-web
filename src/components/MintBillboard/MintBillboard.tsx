import React, { useEffect } from 'react';
import { Button, Card, Col, Row, Typography, Spin } from 'antd';
import { usePrepareContractWrite, useContractWrite } from 'wagmi';
import { EIP5489ForInfluenceMiningContractAddress } from '../../models/parami';
import EIP5489ForInfluenceMining from '../../contracts/EIP5489ForInfluenceMining.json';
import './MintBillboard.scss';
import '../../fonts/NeonRetro.otf';
import BillboardCommon from '../BillboardCommon/BillboardCommon';
import { Influence } from '../../services/mining.service';

const { Title } = Typography;

export interface MintBillboardProps {
    influence: Influence
}

function MintBillboard({ influence }: MintBillboardProps) {
    const { config } = usePrepareContractWrite({
        address: EIP5489ForInfluenceMiningContractAddress,
        abi: EIP5489ForInfluenceMining.abi,
        functionName: 'mint',
        args: [influence.twitterProfileImageUri ?? '']
    });
    const { data, isLoading, isSuccess, write: mint } = useContractWrite(config);
    
    useEffect(() => {
        if (isSuccess) {
            window.location.reload();
        }
    }, [isSuccess])

    return <>
        <Spin spinning={isLoading}>
            <div className='mint-billboard-container'>
                <Title level={3} className='title'>Choose Your Billboard</Title>

                <Row gutter={12}>
                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                        <div className='nft-card'>
                            <div className='content-container'>
                                <div className='billboard'>
                                    <BillboardCommon />
                                </div>

                                <div className='info-container'>
                                    <div className='info'>
                                        {/* <div className='name'>Common Billboard</div> */}
                                        <div className='description'>
                                            Entry level billboard. Monetize your social influence for free.
                                        </div>
                                    </div>
                                    <div className='price'>
                                        <div className='price-title'>Price:</div>
                                        <div className='price-value'>Free</div>
                                    </div>
                                </div>
                            </div>

                            <div className='btn-container'>
                                <div className='btn active' onClick={() => {
                                    mint?.();
                                }}>
                                    Mint
                                </div>
                            </div>
                        </div>
                    </Col>

                    <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                        <div className='nft-card'>
                            <div className='content-container'>
                                <div className='billboard'>
                                    <div className='nft-billboard-container rare' style={{ backgroundImage: 'url(/assets/images/rare_wall_bg.png)' }}>
                                        <div className='neon-wrapper'>
                                            <div className='neon-text'>
                                                RARE <br /> BILLBOARD
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='info-container'>
                                    <div className='info'>
                                        {/* <div className='name'>Rare Billboard</div> */}
                                        <div className='description'>
                                            Earn AD3 1.5x faster with this rare billboard.
                                        </div>
                                    </div>
                                    <div className='price'>
                                        <div className='price-title'>Price:</div>
                                        <div className='price-value'>50 AD3</div>
                                    </div>
                                </div>
                            </div>

                            <div className='btn-container'>
                                <div className='btn disabled'>
                                    Coming Soon
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </Spin>
    </>;
};

export default MintBillboard;
