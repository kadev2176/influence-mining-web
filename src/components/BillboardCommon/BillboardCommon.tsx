import React from 'react';
import './BillboardCommon.scss';

export interface BillboardCommonProps { }

function BillboardCommon({ }: BillboardCommonProps) {
    return <>
        <div className='nft-billboard-container' style={{ backgroundImage: 'url(/assets/images/wall_bg.png)' }}>
            <div className='neon-wrapper'>
                <div className='neon-text'>
                    COMMON <br /> BILLBOARD
                </div>
            </div>
        </div>
    </>;
};

export default BillboardCommon;
