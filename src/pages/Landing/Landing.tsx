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
                <h1 className='title'>GPT Miner</h1>
                <div className='description'>
                    <h4>Just be U<span className='superscript'>AI</span></h4>
                    <h4>The World's First 'Social Influence' Mining Initiative Converging AI with Web3</h4>
                </div>

                {/* <div>
                    <div className='action-btn active' onClick={() => {
                        window.open('https://k1ken8ha0bo.typeform.com/to/bCPaD46i');
                    }}>Apply for Beta Access & Whitelist</div>
                </div> */}
            </div>

            {/* <div className='origin-section'>
                <h4 className='title'>A Concept Co-developed by Human & AI</h4>
                <div className='action-btn active'>ORIGIN</div>
            </div> */}

            {/* <div className='type-form-link'>
                <div className='action-btn active'>Apply for Early Access</div>
            </div> */}
        </div>

    </>;
};

export default Landing;
