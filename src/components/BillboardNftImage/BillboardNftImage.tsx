import React from 'react';
import { HNFT_CONFIG } from '../../models/parami';
import { generateSvg } from '../../utils/svg.util';
import './BillboardNftImage.scss';

export interface BillboardNftImageProps {
    imageUrl: string;
    level?: number;
    active?: boolean;
    selected?: boolean;
    showTag?: boolean;
}

function BillboardNftImage({ imageUrl, level = 0, active, selected, showTag = true }: BillboardNftImageProps) {
    // todo: default image url
    const svg = generateSvg(imageUrl, level);

    return <>
        <div className={`nft-image-container ${active ? 'active' : ''} ${selected ? 'selected' : ''}`}>
            {showTag && <>
                <div className='boost-tag'>
                    {HNFT_CONFIG[level].rank}
                </div>
            </>}

            <div className='svg-container'>
                <img className='nft-image' src={imageUrl}></img>
                <div className='nft-badge-container'>
                    <img src={`/assets/nfts/badge-level-${level}.svg`}></img>
                </div>
            </div>
        </div>
    </>;
};

export default BillboardNftImage;
