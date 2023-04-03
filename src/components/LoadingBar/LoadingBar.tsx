import React from 'react';
import './LoadingBar.scss';

export interface LoadingBarProps { }

function LoadingBar({ }: LoadingBarProps) {
    return <>
        <div className='loading-bar-container'>
            <div className='logo-container'>
                <img className='logo' src='/logo_trans.png'></img>
                <span className='title'>GPTMiner</span>
            </div>
            <div className='loading'>
                <div className='loading-bar'></div>
            </div>
        </div>
    </>;
};

export default LoadingBar;
