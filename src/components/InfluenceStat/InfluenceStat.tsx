import { Col, Row, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { getPoolSummary, Influence, PoolSummary } from '../../services/mining.service';
import './InfluenceStat.scss';

const { Title } = Typography;

export interface InfluenceStatProps {
    influence: Influence;
}

function InfluenceStat({ influence }: InfluenceStatProps) {
    const [poolSummary, setPoolSummary] = useState<PoolSummary>();

    useEffect(() => {
        getPoolSummary().then((res) => {
            setPoolSummary(res);
        })
    }, [])

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
            <Row gutter={12} style={{ marginBottom: '10px' }}>
                <Col span={12}>
                    <div className='influence-score'>
                        <div className='title'>Social Influence</div>
                        <div className='value'>{influence.influence}</div>
                    </div>
                </Col>
            </Row>
            <Row gutter={12}>
                {getStatCard('Twitter Followers', influence.twitFollowerCount)}
                {getStatCard('Referral Count', influence.accountReferalCount)}
                {getStatCard('Extension Referral Count', influence.pluginReferalCount)}
                {poolSummary && getStatCard('Total Influence', poolSummary.totalInfluence)}
                {poolSummary && getStatCard('Total Daily AD3 Rewards', poolSummary.currentDailyOutput)}
            </Row>
        </div>
    </>;
};

export default InfluenceStat;
