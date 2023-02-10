import React from 'react';
import { generateSvg } from '../../utils/svg.util';
import './BillboardNftImage.scss';

export interface BillboardNftImageProps {
    imageUrl: string;
    level?: number;
}

function BillboardNftImage({ imageUrl, level = 0 }: BillboardNftImageProps) {
    // todo: default image url
    const svg = generateSvg(imageUrl, level);

    return <>
        <div className='svg-container' dangerouslySetInnerHTML={{__html: svg}} />
    </>;
};

export default BillboardNftImage;
