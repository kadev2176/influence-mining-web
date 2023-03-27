import React from 'react';
import './Confetti.scss';

export interface ConfettiProps { }

function Confetti({ }: ConfettiProps) {
    return <>
        <div className='confetti-container'>
            {[...Array(30)].map((_, index) => {
                return <div key={index} className={`confetti-${index}`}></div>
            })}
        </div>
    </>;
};

export default Confetti;
