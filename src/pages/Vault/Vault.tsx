import React, { useCallback, useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { useNavigate } from 'react-router-dom';
import LeaderBoard from '../../components/LeaderBoard/LeaderBoard';
import { useImAccount } from '../../hooks/useImAccount';
import { useInterval } from '../../hooks/useInterval';
import { Ad3Activity, getAD3Activity, getAd3Balance, getUpcomingTweetMiner, UpcomingTweetMiner, updateInfluence } from '../../services/mining.service';
import { fetchOembedTweet, OembedTweet } from '../../services/twitter.service';
import { amountToFloatString } from '../../utils/format.util';
import './Vault.scss';
import { CheckCircleOutlined } from '@ant-design/icons';
import { isMobile } from 'react-device-detect';
import { Tooltip } from 'antd';

export interface VaultProps { }

const MinerTweetHashTag = '#GPTMiner';

const postTweet = () => {
    if (isMobile) {
        window.open(`twitter://post?message=${encodeURIComponent(MinerTweetHashTag)}`);
        return;
    }

    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(MinerTweetHashTag)}`);
}

interface MostRecentTweet extends OembedTweet {
    evaluation: string;
    justPosted: boolean;
    isMiner: boolean;
}

function Vault({ }: VaultProps) {
    const [totalBalance, setTotalBalance] = useState<string>();
    const [upcomingTweet, setUpcomingTweet] = useState<UpcomingTweetMiner | null>();
    const [mostRecentTweet, setMostRecentTweet] = useState<MostRecentTweet | null>();
    const { imAccount, refresh, loading } = useImAccount();
    const [countdown, setCountdown] = useState<{ hours: string; mins: string }>({ hours: '-', mins: '-' });
    const navigate = useNavigate();
    const [ad3Activity, setAd3Activity] = useState<Ad3Activity>();

    const [profitStep, setProfitStep] = useState<string>('0');
    const [decimals, setDecimals] = useState<number>(2);

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
        const tweet = await getUpcomingTweetMiner();
        setUpcomingTweet(tweet || null);
    }

    useInterval(updateUpcomingMiner, 5000, true);

    const updateMostRecentTweet = async () => {
        const id = upcomingTweet?.tweetId ?? imAccount?.tweetId;
        if (id) {
            const tweet = await fetchOembedTweet(id);
            if (!tweet) {
                setMostRecentTweet(null);
                return;
            }
            const postedTime = (new Date(upcomingTweet?.createdTime ?? '0')).getTime();
            const zero = new Date();
            zero.setHours(0, 0, 0, 0);

            setMostRecentTweet({
                ...tweet,
                evaluation: (upcomingTweet?.tweetId === imAccount?.tweetId) ? imAccount?.tweetEvaluation ?? '' : '',
                justPosted: postedTime > zero.getTime(),
                isMiner: upcomingTweet?.tweetId === imAccount?.tweetId
            });
        } else {
            setMostRecentTweet(null);
        }
    }

    useEffect(() => {
        if (imAccount && upcomingTweet !== undefined) {
            updateMostRecentTweet();
        }
    }, [imAccount, upcomingTweet])

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
                        <div className='label'>My Mining Rewards</div>
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
                    {mostRecentTweet !== undefined && <>
                        {!mostRecentTweet && <>
                            <div className='no-tweet-info'>
                                <div className='row'>You have no active GPT mining tweets.</div>
                                <div className='row'>Post any tweet with {MinerTweetHashTag} to begin mining.</div>
                            </div>
                            <div className='button-container'>
                                <div className='action-btn active' onClick={postTweet}>Start Mining</div>
                            </div>
                        </>}

                        {mostRecentTweet && <>
                            {!mostRecentTweet.justPosted && <>
                                <div className='post-hint'>
                                    <div className='text'>You current tweet is mining and will expire in: {countdown.hours}h {countdown.mins}m</div>
                                    <div className='action-btn active' onClick={postTweet}>Post a New Tweet</div>
                                </div>
                            </>}

                            <div className='tweet-label'>Most Recent Tweet:</div>

                            <div className='tweet-row'>
                                <div className='miner-tweet'>
                                    <img className='avatar' src={imAccount?.twitterProfileImageUri} referrerPolicy="no-referrer" onClick={() => {
                                        window.open(mostRecentTweet.authorUrl);
                                    }}></img>
                                    <div className='tweet-content'>
                                        <div className='author' onClick={() => {
                                            window.open(mostRecentTweet.authorUrl);
                                        }}>@{mostRecentTweet.authorName}</div>
                                        <div className='content' onClick={() => {
                                            window.open(mostRecentTweet.tweetUrl);
                                        }}>{mostRecentTweet.tweetContent}</div>
                                    </div>
                                </div>

                                <div className='status'>
                                    <div className='tag'>
                                        {!!mostRecentTweet.evaluation && <>
                                            <CheckCircleOutlined />
                                            <span className='text'>GPT Evaluated</span>
                                        </>}

                                        {!mostRecentTweet.evaluation && <>
                                            Pending
                                        </>}
                                    </div>
                                </div>
                            </div>

                            <div className={`gpt-row`}>
                                <div className={`gpt-evaluation`}>
                                    {!!mostRecentTweet.evaluation && <>
                                        <div className='title'>GPT Evaluation:</div>
                                        <div className='content'>
                                            {mostRecentTweet.evaluation}
                                        </div>
                                    </>}

                                    {!mostRecentTweet.evaluation && <>
                                        <div className='content'>
                                            {mostRecentTweet.isMiner && <>
                                                Your tweet has been submitted and is being evaluated by ChatGPT. The influence score will be calculated in a minute.
                                            </>}

                                            {!mostRecentTweet.isMiner && <>
                                                Your tweet has been submitted and is being evaluated by ChatGPT. The final influence score will be calculated in:
                                                <span className='count-down'>
                                                    {countdown.hours}h {countdown.mins}m
                                                </span>
                                            </>}
                                        </div>
                                    </>}
                                </div>
                            </div>
                        </>}
                    </>}

                </div>
            </div>

            {imAccount && <LeaderBoard imAccount={imAccount}></LeaderBoard>}

        </div>
    </>;
};

export default Vault;
