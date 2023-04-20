import React from 'react';
import './GPTScore.scss';

export interface GPTScoreProps {
    label: string;
    value: string;
}

function GPTScore({ label, value }: GPTScoreProps) {
    return <>
        <div className='gpt-score-card'>
            <div className='gpt-score-label'>{label}</div>
            <div className='gpt-score-value'>{value}</div>
        </div>
    </>;
};

export default GPTScore;
