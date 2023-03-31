import React, { useEffect, useState } from 'react';
import Background from '../../components/Background/Background';
import './Landing.scss';

export interface LandingProps { }

function Landing({ }: LandingProps) {

    const [scrollY, setScrollY] = useState<number>(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        }

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, [])

    return <>
        <Background complex={true} scrollY={scrollY}></Background>

        <div className='content-container'>
            <div className='title-section'>
                <div className='title'>GPT Miner</div>
                <div className='description'>
                    <div>Just be U<span className='superscript'>AI</span></div>
                    <div>The World's First 'Social Influence' Mining Initiative Converging AI with Web3</div>
                </div>


                <div className='action-btn-primary active' onClick={() => {
                    window.open('https://k1ken8ha0bo.typeform.com/to/bCPaD46i');
                }}>
                    <div className='btn-icon'>
                        <i className="fa-solid fa-arrow-right"></i>
                    </div>
                    Apply for Beta Access & Whitelist
                </div>
            </div>

            <div className='origin-section'>
                <h4 className='title'>A Concept Co-developed by Human & AI</h4>
                <div className='action-btn-primary active' onClick={() => {
                    window.open('https://parami.gitbook.io/gpt-miner/welcome-to-gpt-miner/origination');
                }}>
                    <div className='btn-icon'>
                        <i className="fa-solid fa-arrow-right"></i>
                    </div>
                    Origin
                </div>
            </div>
        </div>

    </>;
};

export default Landing;
