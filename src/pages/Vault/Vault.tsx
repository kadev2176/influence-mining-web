import React, { useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import LeaderBoard from '../../components/LeaderBoard/LeaderBoard';
import { useImAccount } from '../../hooks/useImAccount';
import { getAd3Balance, queryYFIStakingActivity } from '../../services/mining.service';
import { fetchOembedTweet, OembedTweet } from '../../services/twitter.service';
import { formatAd3Amount } from '../../utils/format.util';
import { CheckCircleOutlined } from '@ant-design/icons';
import './Vault.scss';
import { useNavigate } from 'react-router-dom';

export interface VaultProps { }

const MinerTweetHashTag = '#GPTTest';

function Vault({ }: VaultProps) {
    const { address, isConnected } = useAccount();
    const { chain } = useNetwork();
    const [totalBalance, setTotalBalance] = useState<string>();
    const [minerTweet, setMinerTweet] = useState<OembedTweet>();
    const { imAccount } = useImAccount();
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState<{ hours: string; mins: string }>({ hours: '-', mins: '-' });

    useEffect(() => {
        if (!isConnected) {
            navigate('/auth');
        }
    }, [isConnected]);

    useEffect(() => {
        if (imAccount?.tweetId) {
            fetchOembedTweet(imAccount.tweetId).then(tweet => {
                setMinerTweet(tweet);
            });
        }
    }, [imAccount]);

    useEffect(() => {
        if (address && chain) {
            getAd3Balance(address, chain.id).then(balance => {
                setTotalBalance((BigInt(balance.withdrawable) + BigInt(balance.locked)).toString());
            })

            // queryYFIStakingActivity(address);
        }
    }, [address, chain])

    useEffect(() => {
        const id = setInterval(() => {
            const deadline = new Date();
            deadline.setHours(24, 0, 0, 0);
            const diff = deadline.getTime() - Date.now()
            const hours = Math.floor(diff / (3600 * 1000));
            const mins = Math.ceil((diff % (3600 * 1000) / 1000 / 60));
            setCountdown({
                hours: `${hours}`,
                mins: `${mins}`
            })
        }, 1000);

        return () => clearInterval(id);
    }, []);

    return <>
        <div className='vault-container'>
            <div className='user-section'>
                <div className='mining-reward'>
                    <div className='label'>My Claimable Mining Reward</div>
                    <div className='reward-row'>
                        <div className='reward'>
                            <div className='balance'>{formatAd3Amount(totalBalance ?? '')}</div>
                            <div className='unit'>$AD3</div>
                        </div>
                        <div className='action-btn disabled'>Claim</div>
                    </div>
                </div>

                <div className='tweet-status'>
                    {imAccount && !imAccount.tweetId && <>
                        <div className='no-tweet-info'>
                            <div className='row'>You have not yet posted a tweet to participate in GPT mining.</div>
                            <div className='row'>Post any tweet with {MinerTweetHashTag} to participate in mining.</div>
                        </div>
                        <div className='button-container'>
                            <div className='action-btn active' onClick={() => {
                                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(MinerTweetHashTag)}`);
                            }}>Start Mining</div>
                        </div>
                    </>}

                    {minerTweet && <>
                        <div className='tweet-label'>My {MinerTweetHashTag} Tweet:</div>

                        <div className='miner-tweet'>
                            <img className='avatar' src={imAccount?.twitterProfileImageUri} referrerPolicy="no-referrer"></img>
                            <div className='tweet-content'>
                                <div className='author'>@{minerTweet.authorName}</div>
                                <div className='content'>{minerTweet.tweetContent}</div>
                            </div>
                        </div>

                        <div className='tweet-submit-status'>
                            <div className='mark'>
                                <CheckCircleOutlined />
                            </div>
                            <div className='info'>
                                Your tweet has been submitted and under evaluation by ChatGPT.
                            </div>
                        </div>
                        <div className='score-status'>
                            <div className='info'>The final influence score will be calculated after:</div>
                            <div className='value'>
                                <div>{countdown.hours}h {countdown.mins}m</div>
                            </div>
                        </div>
                    </>}
                </div>
            </div>
            <div className='divider'></div>
            <LeaderBoard></LeaderBoard>
        </div>
    </>;
};

export default Vault;
