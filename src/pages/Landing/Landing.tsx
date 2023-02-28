import React from 'react';
import Background from '../../components/Background/Background';
import './Landing.scss';

export interface LandingProps { }

function Landing({ }: LandingProps) {
    return <>
        <Background complex={true}></Background>

        <div className='content-container'>
            <div className='title-section'>
                <h1 className='title'>GPT Miner</h1>
                <div className='description'>
                    <h4>Just be U<span className='superscript'>ai</span></h4>
                    <h4>Tweet and mine with your personal chatGPT miner</h4>
                </div>
            </div>
        </div>

    </>;
};

export default Landing;
