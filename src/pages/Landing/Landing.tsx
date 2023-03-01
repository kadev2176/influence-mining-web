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
                    <h4>Just be U<span className='superscript'>AI</span></h4>
                    <h4>World's 1st "Social Influence" Mining Initiative Converging AI with Web3</h4>
                </div>
            </div>

            {/* <div className='type-form-link'>
                <div className='action-btn active'>Apply for Early Access</div>
            </div> */}
        </div>

    </>;
};

export default Landing;
