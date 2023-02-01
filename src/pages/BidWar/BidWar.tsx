import React from 'react';
import { Typography, Button } from 'antd';
import { PARAMI_WALLET } from '../../models/parami';
import { useHNFT } from '../../hooks/useHNFT';

const { Title } = Typography;

export interface BidWarProps { }

function BidWar({ }: BidWarProps) {
    const hnft = useHNFT();

    return <>
        <Title level={3}>Bid War</Title>
        <div className='btn-container'>
            {hnft && <>
                <Button type='primary'
                    onClick={() => {
                        window.open(`${PARAMI_WALLET}/enlist/${hnft.address}/${hnft.tokenId}`);
                    }}
                >Enlist Now</Button>
            </>}
        </div>
    </>;
};

export default BidWar;
