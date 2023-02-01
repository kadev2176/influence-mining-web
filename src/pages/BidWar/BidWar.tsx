import React from 'react';
import { Typography, Button } from 'antd';

const { Title } = Typography;

export interface BidWarProps { }

function BidWar({ }: BidWarProps) {
    return <>
        <Title level={3}>Bid War</Title>
        <div className='btn-container'>
            <Button type='primary'>Enlist Now</Button>
        </div>
    </>;
};

export default BidWar;
