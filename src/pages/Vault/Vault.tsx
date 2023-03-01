import React, { useCallback, useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { useNavigate } from 'react-router-dom';
import LeaderBoard from '../../components/LeaderBoard/LeaderBoard';
import { useImAccount } from '../../hooks/useImAccount';
import { useInterval } from '../../hooks/useInterval';
import { Ad3Activity, getAD3Activity, getAd3Balance, getUpcomingTweetMiner, updateInfluence } from '../../services/mining.service';
import { fetchOembedTweet, OembedTweet } from '../../services/twitter.service';
import { amountToFloatString } from '../../utils/format.util';
import './Vault.scss';
import { CheckCircleOutlined } from '@ant-design/icons';
import { isMobile } from 'react-device-detect';
import { Tooltip } from 'antd';

export interface VaultProps { }

const MinerTweetHashTag = '#GPTTest';

function Vault({ }: VaultProps) {
    const [totalBalance, setTotalBalance] = useState<string>();
    const [minerTweet, setMinerTweet] = useState<OembedTweet | null>();
    const { imAccount, refresh, loading } = useImAccount();
    const [countdown, setCountdown] = useState<{ hours: string; mins: string }>({ hours: '-', mins: '-' });
    const navigate = useNavigate();
    const [ad3Activity, setAd3Activity] = useState<Ad3Activity>();

    const [profitStep, setProfitStep] = useState<string>('0');
    const [decimals, setDecimals] = useState<number>(2);
    const [gptEvaluationExpand, setGptEvaluationExpand] = useState<boolean>(false);

    useEffect(() => {
        if (!loading && !imAccount) {
            navigate('/auth');
        }
    }, [imAccount, loading])

    useEffect(() => {
        getAd3Balance().then(balance => {
            console.log('got ad3 balance', balance);
            if (balance) {
                setTotalBalance(amountToFloatString(BigInt(balance.balance) + BigInt(balance.earned)));
            }
        })

        getAD3Activity().then(ad3Activity => {
            if (ad3Activity) {
                setAd3Activity(ad3Activity);
            }
        })
    }, [])

    useEffect(() => {
        // todo: change calculation
        if (ad3Activity && imAccount) {
            if (Number(ad3Activity.miningBalance) === 0) {
                return;
            }

            const outputPerSecond = BigInt(ad3Activity.dailyOutput) / BigInt(86400);
            const profitPerSecond = outputPerSecond * BigInt(imAccount.influence) / BigInt(ad3Activity.miningBalance);
            const step = profitPerSecond * BigInt(2);

            if (Number(step) > 0) {
                const decimals = Math.min(18, Math.max(18 - step.toString().length + 2, 2));
                console.log('got decimals', decimals);
                setDecimals(decimals);
                setProfitStep(amountToFloatString(step));
            }

            console.log('ad3Activity', ad3Activity);
            console.log('profit step (2 sec)', step);
        }
    }, [ad3Activity, imAccount])

    const addBalance = () => {
        if (totalBalance && profitStep) {
            setTotalBalance((Number(totalBalance) + Number(profitStep)).toString());
        }
    }

    useInterval(addBalance, 2000);

    const updateUpcomingMiner = async () => {
        const miner = await getUpcomingTweetMiner();
        if (miner?.tweetId) {
            const minerTweet = await fetchOembedTweet(miner.tweetId);
            setMinerTweet(minerTweet);
        } else {
            setMinerTweet(null);
        }
    }

    useInterval(updateUpcomingMiner, 5000, true);

    const refreshInfluence = async () => {
        console.log('updating influence, once per minute...');
        updateInfluence().then((_) => {
            refresh();
        })
    }

    useInterval(refreshInfluence, 60 * 1000, true);

    useInterval(() => {
        const deadline = new Date();
        deadline.setHours(24, 0, 0, 0);
        const diff = deadline.getTime() - Date.now()
        const hours = Math.floor(diff / (3600 * 1000));
        const mins = Math.ceil((diff % (3600 * 1000) / 1000 / 60));
        setCountdown({
            hours: `${hours}`,
            mins: `${mins}`
        })
    }, 1000, true);

    return <>
        <div className='vault-container'>
            <div className='user-section'>
                <div className='mining-reward'>
                    <div className='label-row'>
                        <div className='label'>My Claimable Mining Reward</div>
                        <div className='action-btn disabled'>Claim</div>
                    </div>

                    <div className='reward-row'>
                        <div className='balance'>
                            {totalBalance !== undefined && <>
                                {(Number(totalBalance) + Number(profitStep)).toString() === '0' && <>
                                    0.00
                                </>}
                                {(Number(totalBalance) + Number(profitStep)).toString() !== '0' && <>
                                    <CountUp end={Number(totalBalance) + Number(profitStep)} start={Number(totalBalance)} decimals={decimals} delay={0} duration={1}></CountUp>
                                </>}
                            </>}
                        </div>
                        <div className='unit'>$AD3</div>
                    </div>
                </div>

                <div className='tweet-status'>
                    {minerTweet !== undefined && <>
                        {!minerTweet && <>
                            <div className='no-tweet-info'>
                                <div className='row'>You have not yet posted a tweet to participate in GPT mining.</div>
                                <div className='row'>Post any tweet with {MinerTweetHashTag} to participate in mining.</div>
                            </div>
                            <div className='button-container'>
                                <div className='action-btn active' onClick={() => {
                                    if (isMobile) {
                                        window.open(`twitter://post?message=${encodeURIComponent(MinerTweetHashTag)}`);
                                        return;
                                    }

                                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(MinerTweetHashTag)}`);
                                }}>Start Mining</div>
                            </div>
                        </>}

                        {minerTweet && <>
                            <div className='tweet-label'>My recent {MinerTweetHashTag} Tweet:</div>

                            <div className='tweet-row'>
                                <div className='miner-tweet'>
                                    <img className='avatar' src={imAccount?.twitterProfileImageUri} referrerPolicy="no-referrer" onClick={() => {
                                        window.open(minerTweet.authorUrl);
                                    }}></img>
                                    <div className='tweet-content'>
                                        <div className='author' onClick={() => {
                                            window.open(minerTweet.authorUrl);
                                        }}>@{minerTweet.authorName}</div>
                                        <div className='content' onClick={() => {
                                            window.open(minerTweet.tweetUrl);
                                        }}>{minerTweet.tweetContent}</div>
                                    </div>
                                </div>

                                {minerTweet.tweetId === imAccount?.tweetId && !!imAccount.tweetEvaluation && <>
                                    <div className='status' onClick={() => {
                                        setGptEvaluationExpand(!gptEvaluationExpand);
                                    }}>
                                        <div className='expand-btn'>
                                            <CheckCircleOutlined />
                                            <span className='text'>GPT Evaluated</span>
                                            {gptEvaluationExpand && <>
                                                <span>
                                                    <i className="fa-solid fa-chevron-up"></i>
                                                </span>
                                            </>}
                                            {!gptEvaluationExpand && <>
                                                <span>
                                                    <i className="fa-solid fa-chevron-down"></i>
                                                </span>
                                            </>}
                                        </div>
                                    </div>
                                </>}

                                {(minerTweet.tweetId !== imAccount?.tweetId || !imAccount.tweetEvaluation) && <>
                                    <div className='status'>
                                        <Tooltip title="Your tweet is under ChatGPT evaluation" placement='bottom'>
                                            <div className='tag'>Pending...</div>
                                        </Tooltip>
                                    </div>
                                </>}
                            </div>

                            <div className={`gpt-row ${gptEvaluationExpand ? 'show' : 'hide'}`}>
                                <div className={`gpt-evaluation`}>
                                    <div className='title'>GPT Evaluation:</div>
                                    <div className='content'>{imAccount?.tweetEvaluation}</div>
                                </div>
                            </div>

                            {/* <div className='tweet-submit-status'>
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
                            </div> */}
                        </>}
                    </>}

                </div>
            </div>
            <div className='divider'></div>
            <LeaderBoard></LeaderBoard>
        </div>
    </>;
};

export default Vault;
