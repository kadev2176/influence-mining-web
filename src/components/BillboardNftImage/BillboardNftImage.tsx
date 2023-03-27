import React from 'react';
import { generateSvg } from '../../utils/svg.util';
import './BillboardNftImage.scss';

export interface BillboardNftImageProps {
    imageUrl: string;
    level?: number;
    active?: boolean;
    selected?: boolean;
}

function BillboardNftImage({ imageUrl, level = 0, active, selected }: BillboardNftImageProps) {
    // todo: default image url
    const svg = generateSvg(imageUrl, level);

    return <>
        <div className={`nft-image ${active ? 'active' : ''} ${selected ? 'selected' : ''}`}>
            <div className='boost-tag'>
                <span className='icon'><i className="fa-solid fa-rocket"></i></span>
                2X
            </div>

            <div className='svg-container' dangerouslySetInnerHTML={{ __html: svg }} />
        </div>
    </>;
};

export default BillboardNftImage;
