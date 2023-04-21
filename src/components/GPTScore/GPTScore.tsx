import React, { useState } from 'react';
import './GPTScore.scss';
import BoostModal from '../BoostModal/BoostModal';

export interface GPTScoreProps {
    label: string;
    value: string;
    boost?: boolean;
}

function GPTScore({ label, value, boost }: GPTScoreProps) {
    const [boostModal, setBoostModal] = useState<boolean>(false);
    return <>
        <div className={`gpt-score-card ${boost ? 'boost' : ''}`} onClick={() => {
            if (boost) {
                setBoostModal(true);
            }
        }}>
            <div className='gpt-score-label'>{label}</div>
            <div className='gpt-score-value'>{value}</div>
        </div>

        {boostModal && <>
            <BoostModal onCancel={() => {
                setBoostModal(false);
            }}></BoostModal>
        </>}
    </>;
};

export default GPTScore;
