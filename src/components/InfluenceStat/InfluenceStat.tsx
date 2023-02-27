import { Col, Row, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { getPoolSummary, ImAccount, PoolSummary } from '../../services/mining.service';
import { amountToFloatString, formatAd3Amount, formatInfluenceScore } from '../../utils/format.util';
import './InfluenceStat.scss';

const { Title } = Typography;

export interface InfluenceStatProps {
    influence: ImAccount;
}

function InfluenceStat({ influence }: InfluenceStatProps) {
    const navigate = useNavigate();
    const [poolSummary, setPoolSummary] = useState<PoolSummary>();
    const { address } = useAccount();

    useEffect(() => {
        if (address) {
            getPoolSummary().then((res) => {
                setPoolSummary(res);
            })
        }
    }, [address])

    const getStatCard = (title: string, value: string | number) => {
        return <Col xl={6} lg={6} md={12} sm={12} xs={12}>
            <div className='influence-stat'>
                <div className='title'>{title}</div>
                <div className='value'>{value}</div>
            </div>
        </Col>
    }

    return <>
        <Title level={3}>Your Social Influence</Title>
        <div className='influence-stat-card'>
            <Row style={{ width: '100%' }}>
                <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                    <div className='total-influence'>
                        <div className='title'>Mining Influence</div>
                        {/* <div className='icon'>
                            <img src='/logo-round-core.svg'></img>
                            Mining Influence
                        </div> */}
                        <div className='value' onClick={() => {
                            navigate('/influenceTx')
                        }}>
                            <div className='balance'>
                                {formatInfluenceScore(influence.influence)}
                            </div>
                        </div>
                    </div>
                </Col>
                <Col xl={12} lg={12} md={24} sm={24} xs={24} className='sub-influence'>
                    <Row justify="space-between" className='sub-influence-row'>
                        <Col className='label'>
                            <i className="fa-solid fa-user"></i>
                            <span className='text'>Social Influence</span>
                        </Col>
                        <Col className='value'>
                            <div className='balance'>{formatInfluenceScore(influence.influence)}</div>
                        </Col>
                        {/* <Col className='action'>
                            <div>
                                <Button type='primary' onClick={() => {
                                    setWithdrawModal(true);
                                }}>Withdraw</Button>
                            </div>
                        </Col> */}
                    </Row>
                    <Row justify="space-between" className='sub-influence-row'>
                        <Col className='label'>
                            <i className="fa-solid fa-star"></i>
                            <span className='text'>Bonus Influence</span>
                        </Col>
                        <Col className='value'>
                            <div className='balance'>{0}</div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
        <div className='influence-stat-card'>
            {/* <Row gutter={12} style={{ marginBottom: '10px' }}>
                <Col span={12}>
                    <div className='influence-score' onClick={() => {
                        navigate('/influenceTx')
                    }}>
                        <div className='title'>Social Influence</div>
                        <div className='value'>{influence.influence}</div>
                    </div>
                </Col>
            </Row> */}
            <Row gutter={12}>
                {getStatCard('Referral Count', influence.accountReferalCount)}
                {getStatCard('Extension Referral Count', influence.pluginReferalCount)}
                {poolSummary && getStatCard('Total Influence', formatInfluenceScore(poolSummary.totalInfluence))}
                {poolSummary && getStatCard('Total Daily AD3 Rewards', formatAd3Amount(poolSummary.currentDailyOutput))}
            </Row>
        </div>
    </>;
};

export default InfluenceStat;
