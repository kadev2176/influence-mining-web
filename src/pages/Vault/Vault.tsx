import React, { useCallback, useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { useNavigate } from 'react-router-dom';
import LeaderBoard from '../../components/LeaderBoard/LeaderBoard';
import { useImAccount } from '../../hooks/useImAccount';
import { useInterval } from '../../hooks/useInterval';
import { Ad3Activity, getAD3Activity, getAd3Balance, getUpcomingTweetMiner, UpcomingTweetMiner, updateInfluence, ImAccount } from '../../services/mining.service';
import { fetchOembedTweet, OembedTweet } from '../../services/twitter.service';
import { amountToFloatString } from '../../utils/format.util';
import './Vault.scss';
import { CheckCircleOutlined } from '@ant-design/icons';
import { isMobile } from 'react-device-detect';
import dayjs from 'dayjs'
import { useCountdown } from '../../hooks/useCountdown';
import TweetGeneratorModal from '../../components/TweetGeneratorModal/TweetGeneratorModal';
import SigninModal from '../../components/SigninModal/SigninModal';

const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

export interface VaultProps { }

const MinerTweetHashTag = '#GPTMiner';

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
    const countdown = useCountdown();

    const navigate = useNavigate();
    const [ad3Activity, setAd3Activity] = useState<Ad3Activity>();

    const [profitStep, setProfitStep] = useState<string>('0');
    const [decimals, setDecimals] = useState<number>(2);

    const [tweetGeneratorModal, setTweetGeneratorModal] = useState<boolean>(false);
    const [signinModal, setSigninModal] = useState<boolean>(false);

    useEffect(() => {
        document.title = 'GPT Miner | Vault';
    }, []);

    useEffect(() => {
        if (!loading && !imAccount) {
            // navigate('/auth');
            setSigninModal(true);
        }
    }, [imAccount, loading])

    useInterval(() => {
        refresh()
    }, 10 * 1000, false);

    useEffect(() => {
        getAd3Balance().then(balance => {
            // console.log('got ad3 balance', balance);
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
        console.log('got upcoming tweet', tweet);
        setUpcomingTweet(tweet || null);
    }

    const updateMostRecentTweet = async (imAccount: ImAccount) => {

        const id = imAccount?.tweetId;
        if (id) {
            const tweet = await fetchOembedTweet(id);
            if (!tweet) {
                setMostRecentTweet(null);
                return;
            }

            // const createdTime = (dayjs as any).utc(upcomingTweet?.createdTime ?? '0');
            // const latestMidnight = (dayjs as any).utc().hour(0).minute(0).second(0).millisecond(0);
            // const midnightBefore = latestMidnight.subtract(1, 'day');

            // if (midnightBefore.unix() > createdTime.unix()) {
            //     setMostRecentTweet(null);
            //     return;
            // }

            setMostRecentTweet({
                ...tweet,
                evaluation: imAccount?.tweetEvaluation ?? '',
                // justPosted: createdTime.unix() > latestMidnight.unix(),
                justPosted: true,
                // isMiner: !imAccount?.tweetId || upcomingTweet?.tweetId === imAccount?.tweetId
                isMiner: true
            });
        } else {
            setMostRecentTweet(null);
        }
    }

    useEffect(() => {
        if (imAccount) {
            updateMostRecentTweet(imAccount);
        }
    }, [imAccount])

    // todo: subscribe to graphQL changes
    // const refreshInfluence = async () => {
    //     console.log('updating influence, once per minute...');
    //     updateInfluence().then((_) => {
    //         refresh();
    //     })
    // }

    return <>
        <div className='vault-container'>
            <div className='miner-title'>Miner</div>
            <div className='miner-description'>
                GPT evaluates your Tweet (attaching #GPTMiner) based on Originality, Creativity, Practicality, Personality & Discussability and generates a SCORE based on which, you will be earning rewards.
            </div>

            <div className='section-card post-tweet'>
                <div className='post-info'>Tweet with <span className='hashtag'>{MinerTweetHashTag}</span> to start mining!</div>
                <div className='twit-btn action-btn-primary active' onClick={() => {
                    setTweetGeneratorModal(true);
                }}>Tweet</div>
            </div>

            {mostRecentTweet && <>
                <div className='section-card miner-tweet'>
                    <div className='gpt-evaluation'>
                        <div className='title'>
                            <div className='text'>GPT Evaluation</div>
                            <div className='tag'>Only the latest one is shown</div>
                        </div>
                        <div className='evaluation'>
                            {mostRecentTweet.evaluation}
                        </div>
                    </div>
                    <div className='tweet'>
                        <img className='avatar' src={imAccount?.twitterProfileImageUri} referrerPolicy="no-referrer" onClick={() => {
                            window.open(mostRecentTweet.authorUrl);
                        }}></img>
                        <div className='tweet-content'>
                            <div className='user-row' onClick={() => {
                                window.open(mostRecentTweet.authorUrl);
                            }}>
                                <span className='username'>{imAccount?.twitterName}</span>
                                <span className='twitter-name'>@{imAccount?.twitterUsername}</span>
                            </div>
                            <div className='content-row' onClick={() => {
                                window.open(mostRecentTweet.tweetUrl);
                            }}>
                                {mostRecentTweet.tweetContent}
                            </div>
                        </div>
                        <div className='mining-indicator'>

                        </div>

                        <div className='corner-tag'>
                            <div className='icon'>
                                <i className="fa-solid fa-check"></i>
                            </div>
                            indexed
                        </div>
                    </div>
                </div>
            </>}

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
                        <div className='network-tag'>Test Network</div>
                    </div>
                </div>
            </div>

            {imAccount && <LeaderBoard imAccount={imAccount}></LeaderBoard>}
        </div>

        {tweetGeneratorModal && <>
            <TweetGeneratorModal onCancel={() => { setTweetGeneratorModal(false) }}></TweetGeneratorModal>
        </>}

        {signinModal && <>
            <SigninModal></SigninModal>
        </>}
    </>;
};

export default Vault;
