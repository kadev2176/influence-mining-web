import React, { useCallback, useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { useImAccount } from '../../hooks/useImAccount';
import { useInterval } from '../../hooks/useInterval';
import { Ad3Activity, getAD3Activity, getAd3Balance, getUpcomingTweetMiner, UpcomingTweetMiner, updateInfluence, ImAccount, getLeaderBoardImAccounts } from '../../services/mining.service';
import { fetchOembedTweet, OembedTweet } from '../../services/twitter.service';
import { amountToFloatString, formatTwitterImageUrl } from '../../utils/format.util';
import './Miner.scss';
import dayjs from 'dayjs'
import TweetGeneratorModal from '../../components/TweetGeneratorModal/TweetGeneratorModal';
import SigninModal from '../../components/SigninModal/SigninModal';
import LeaderBoardTweet, { LeaderTweet } from '../../components/LeaderBoardTweet/LeaderBoardTweet';

const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

const MinerTweetHashTag = '#GPTMiner';

interface MostRecentTweet extends OembedTweet {
    evaluation: string;
    justPosted: boolean;
    isMiner: boolean;
}

function Miner() {
    const [totalBalance, setTotalBalance] = useState<string>();
    const [mostRecentTweet, setMostRecentTweet] = useState<MostRecentTweet | null>();
    const { imAccount, refresh, loading } = useImAccount();

    const [ad3Activity, setAd3Activity] = useState<Ad3Activity>();

    const [profitStep, setProfitStep] = useState<string>('0');
    const [decimals, setDecimals] = useState<number>(2);

    const [tweetGeneratorModal, setTweetGeneratorModal] = useState<boolean>(false);
    const [signinModal, setSigninModal] = useState<boolean>(false);
    const [leaderTweets, setLeaderTweets] = useState<LeaderTweet[]>();
    const [selectedTweet, setSelectedTweet] = useState<LeaderTweet>();

    useEffect(() => {
        document.title = 'GPT Miner | Miner';
    }, []);

    useEffect(() => {
        if (!loading && !imAccount) {
            setSigninModal(true);
        }
    }, [imAccount, loading])

    useInterval(() => {
        refresh()
    }, 10 * 1000, false);

    useEffect(() => {
        getAd3Balance().then(balance => {
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

    const updateMostRecentTweet = async (imAccount: ImAccount) => {
        const id = imAccount?.tweetId;
        if (id) {
            const tweet = await fetchOembedTweet(id);
            if (!tweet) {
                setMostRecentTweet(null);
                return;
            }

            setMostRecentTweet({
                ...tweet,
                evaluation: imAccount?.tweetEvaluation ?? '',
                justPosted: true,
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

    const fetchLeaderTweets = async () => {
        const leaders = await getLeaderBoardImAccounts(5);
        const leaderTweets = await Promise.all((leaders ?? []).map(async (leaderAccount, index) => {
            const tweet = leaderAccount?.tweetId ? await fetchOembedTweet(leaderAccount.tweetId) : {};
            return {
                avatar: formatTwitterImageUrl(leaderAccount?.twitterProfileImageUri),
                influence: leaderAccount?.influence,
                rank: `${index + 1}`,
                tweetContent: leaderAccount.tweetContent,
                authorName: leaderAccount.twitterName,
                authorUrl: `https://twitter.com/${leaderAccount.twitterUsername}`,
                ...tweet,
                evaluation: leaderAccount.tweetEvaluation ?? ''
            }
        }));
        setLeaderTweets(leaderTweets);
    }

    useEffect(() => {
        fetchLeaderTweets()
    }, [])

    return <>
        <div className='vault-container'>
            <div className='miner-title'>Solo Mining</div>
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

            <div className='miner-title'>Group Mining</div>
            <div className='miner-description'>
                Comment under tweets (attaching #GPTMiner) to boost both yours and the original tweet's SCORE. More quality interaction in a thread means more earnings for everyone engaged.
            </div>

            <div className='section-card select-tweet'>
                <div className='header'>
                    <div className='title'>Select a tweet to reply</div>
                    <div className={`action-btn-primary reply-btn ${selectedTweet ? 'active' : 'disabled'}`}
                        onClick={() => {
                            setTweetGeneratorModal(true);
                        }}
                    >
                        Reply
                    </div>
                </div>
                <div className='tweets'>
                    {leaderTweets && <>
                        {leaderTweets.map(tweet => {
                            return <>
                                <LeaderBoardTweet
                                    tweet={tweet}
                                    isOwner={tweet.authorName === imAccount?.twitterName}
                                    selectable={true}
                                    selected={selectedTweet?.tweetId === tweet.tweetId}
                                    onSelect={(t) => {
                                        setSelectedTweet(t);
                                    }}
                                ></LeaderBoardTweet>
                            </>
                        })}
                    </>}
                </div>
            </div>

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
        </div>

        {tweetGeneratorModal && <>
            <TweetGeneratorModal onCancel={() => { setTweetGeneratorModal(false) }}></TweetGeneratorModal>
        </>}

        {signinModal && <>
            <SigninModal></SigninModal>
        </>}
    </>;
};

export default Miner;
