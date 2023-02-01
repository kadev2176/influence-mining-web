import React from 'react';
import './BillboardRare.scss';

export interface BillboardRareProps { }

function BillboardRare({ }: BillboardRareProps) {
    return <>
        <div className='nft-billboard-container rare' style={{ backgroundImage: 'url(/assets/images/rare_wall_bg.png)' }}>
            <div className='neon-wrapper'>
                <div className='neon-text'>
                    RARE <br /> BILLBOARD
                </div>
            </div>
        </div>
    </>;
};

export default BillboardRare;
