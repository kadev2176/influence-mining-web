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
        <div className={`nft-image ${active ? 'active' : ''} ${selected ? 'selected' : ''}`}>
            {showTag && <>
                <div className='boost-tag'>
                    <span className='icon'><i className="fa-solid fa-rocket"></i></span>
                    {HNFT_CONFIG[level].boost}
                </div>
            </>}

            <div className='svg-container' dangerouslySetInnerHTML={{ __html: svg }} />
        </div>
    </>;
};

export default BillboardNftImage;
