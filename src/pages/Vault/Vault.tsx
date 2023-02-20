import React from 'react';
import './Vault.scss';

export interface VaultProps { }

function Vault({ }: VaultProps) {

    return <>
        <div className='vault-container'>
            <div className='user-section'>
                {true && <>
                    <div className='no-tweet-info'>
                        <div className='row'>You have not yet posted a tweet to participate in GPT mining.</div>
                        <div className='row'>Post any tweet with #GPTMiner to participate in mining.</div>
                    </div>
                    <div className='button-container'>
                        <div className='btn'>Start Mining</div>
                    </div>
                </>}

                {false && <>

                </>}
            </div>
            <div className='leaderboard-section'>
                <div className=''></div>
            </div>
        </div>
    </>;
};

export default Vault;
