import React, { useCallback, useEffect, useState } from 'react';
import { useImAccount } from '../../hooks/useImAccount';
import { useInterval } from '../../hooks/useInterval';
import { ImAccount, getLeaderBoardImAccounts, getPromoIMAccount } from '../../services/mining.service';
import { fetchOembedTweet, OembedTweet } from '../../services/twitter.service';
import { formatInfluenceScore, formatTwitterImageUrl } from '../../utils/format.util';
import './Miner.scss';
import dayjs from 'dayjs'
import TweetGeneratorModal from '../../components/TweetGeneratorModal/TweetGeneratorModal';
import SigninModal from '../../components/SigninModal/SigninModal';
import UserAvatar from '../../components/UserAvatar/UserAvatar';
import Dashboard from '../Dashboard/Dashboard';
import { useCountdown } from '../../hooks/useCountdown';
import GroupMiningTweet, { GroupMiningLeaderTweet } from '../../components/GroupMiningTweet/GroupMiningTweet';
import GPTScore from '../../components/GPTScore/GPTScore';
import { useHNFT } from '../../hooks/useHNFT';
import { isMobile } from 'react-device-detect';
import { OFFICIAL_TAG } from '../../models/parami';
import { useSearchParams } from 'react-router-dom';

const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

interface MostRecentTweet extends OembedTweet {
    originalTweet: OembedTweet | null;
    evaluation: string;
    justPosted: boolean;
    isMiner: boolean;
}

function Miner() {
    const [mostRecentTweet, setMostRecentTweet] = useState<MostRecentTweet | null>();
    const { imAccount, refresh, loading } = useImAccount();

    const [tweetGeneratorModal, setTweetGeneratorModal] = useState<boolean>(false);
    const [signinModal, setSigninModal] = useState<boolean>(false);
    const [leaderTweets, setLeaderTweets] = useState<GroupMiningLeaderTweet[]>();
    const [miningMode, setMiningMode] = useState<'group' | 'solo'>('group');
    const countdown = useCountdown();
    const [showEvaluation, setShowEvaluation] = useState<boolean>(false);
    const hnft = useHNFT();
    const [isKOL, setIsKOL] = useState<boolean>(false);

    const [params] = useSearchParams();

    useEffect(() => {
        if (params && params.get('tag')) {
            setTweetGeneratorModal(true);
        }
    }, [params])

    useEffect(() => {
        if (Number(hnft.level)) {
            setIsKOL(true);
            setMiningMode('solo');
        }
    }, [])

    useEffect(() => {
        document.title = 'GPT Miner | Miner';
    }, []);

    useEffect(() => {
        if (!loading && !imAccount) {
            setSigninModal(true);
        }
    }, [imAccount, loading]);

    useInterval(() => {
        refresh()
    }, 10 * 1000, false);

    const updateMostRecentTweet = async (imAccount: ImAccount) => {
        const id = imAccount?.tweetId;
        if (id) {
            const tweet = await fetchOembedTweet(id);
            if (!tweet) {
                setMostRecentTweet(null);
                return;
            }

            const originalTweetId = imAccount?.conversationId;
            let originalTweet = null;
            if (originalTweetId && originalTweetId !== id) {
                originalTweet = await fetchOembedTweet(originalTweetId);
            }

            setMostRecentTweet({
                ...tweet,
                originalTweet: originalTweet,
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
    }, [imAccount]);

    const fetchLeaderTweets = async () => {
        const promo = await getPromoIMAccount();
        const leaders = await getLeaderBoardImAccounts(30);
        const leaderTweets = await Promise.all([promo!, ...(leaders ?? [])].filter(leader => leader.tweetId === leader.conversationId).slice(0, 5).map(async (leaderAccount, index) => {
            const tweet = leaderAccount?.tweetId ? await fetchOembedTweet(leaderAccount.tweetId) : {};
            return {
                twitterProfileImageUri: formatTwitterImageUrl(leaderAccount?.twitterProfileImageUri),
                influence: leaderAccount?.influence,
                influenceBonus: leaderAccount.influenceBonus,
                influenceBoost: leaderAccount.influenceBoost,
                twitterName: leaderAccount?.twitterName,
                twitterUsername: leaderAccount?.twitterUsername,
                tweetContent: leaderAccount.tweetContent,
                tweetContentScore: leaderAccount.tweetContentScore,
                authorName: leaderAccount.twitterName,
                authorUrl: `https://twitter.com/${leaderAccount.twitterUsername}`,
                ...tweet,
            }
        }));
        setLeaderTweets(leaderTweets);
    }

    useEffect(() => {
        fetchLeaderTweets()
    }, [])

    const currentMiningTweet = <>
        {mostRecentTweet && <>
            <div className='miner-tweet'>
                {mostRecentTweet.originalTweet && <>
                    <div className='section-card miner-tweet-content original'>
                        <div className='tweet-content'>
                            <div className='user-row' onClick={() => {
                                window.open(mostRecentTweet.originalTweet?.authorUrl);
                            }}>
                                <span className='username'>
                                    @{mostRecentTweet.originalTweet.authorName}
                                </span>
                            </div>
                            <div className='content-row' onClick={() => {
                                window.open(mostRecentTweet.originalTweet?.tweetUrl);
                            }}>
                                {mostRecentTweet.originalTweet.tweetContent}
                            </div>
                        </div>

                        {!isMobile && <>
                            <div className='corner-tag'>
                                <div className='timer-label'>Original Tweet</div>
                            </div>
                        </>}
                    </div>
                </>}
                {isMobile && <>
                    <div className='countdown-card'>
                        <div className='timer-label'>Mining time left</div>
                        <div className='timer'>
                            <span className='value'>{countdown.hours}</span>
                            <span className='colon'>:</span>
                            <span className='value'>{countdown.mins}</span>
                            <span className='colon'>:</span>
                            <span className='value'>{countdown.seconds}</span>
                        </div>
                    </div>
                </>}
                <div className='section-card miner-tweet-content'>
                    <div className='avatar-container' onClick={() => {
                        window.open(mostRecentTweet.authorUrl);
                    }}>
                        <UserAvatar className='avatar' src={imAccount?.twitterProfileImageUri}></UserAvatar>
                    </div>
                    <div className='tweet-content'>
                        <div className='user-row' onClick={() => {
                            window.open(mostRecentTweet.authorUrl);
                        }}>
                            <span className='username'>
                                {imAccount?.twitterName}
                            </span>
                            <span className='twitter-name'>@{imAccount?.twitterUsername}</span>
                        </div>
                        {mostRecentTweet.originalTweet && <>
                            <div className='replying-row'>
                                Replying to <span className='replying-name' onClick={() => {
                                    window.open(mostRecentTweet.originalTweet?.authorUrl);
                                }}>@{mostRecentTweet.originalTweet.authorName}</span>
                            </div>
                        </>}
                        <div className='content-row' onClick={() => {
                            window.open(mostRecentTweet.tweetUrl);
                        }}>
                            {mostRecentTweet.tweetContent}
                        </div>
                    </div>

                    {!isMobile && <>
                        <div className='corner-tag'>
                            <div className='timer-label'>Mining time left</div>
                            <div className='timer'>
                                <span className='value'>{countdown.hours}</span>
                                <span className='colon'>:</span>
                                <span className='value'>{countdown.mins}</span>
                                <span className='colon'>:</span>
                                <span className='value'>{countdown.seconds}</span>
                            </div>
                        </div>
                    </>}
                </div>
                <div className='section-card gpt-score'>
                    <div className='label'>GPT Evaluation:</div>
                    <div className='scores'>
                        <GPTScore label={'Base'} value={`+${formatInfluenceScore(imAccount?.tweetContentScore)}`}></GPTScore>
                        <GPTScore label={'Boost'} value={`x${imAccount?.influenceBoost}`} boost></GPTScore>
                        <GPTScore label={'Reply'} value={`+${formatInfluenceScore(imAccount?.influenceBonus)}`}></GPTScore>
                        <GPTScore label={'Total'} value={`+${formatInfluenceScore(imAccount?.influence)}`}></GPTScore>

                        <div className='toggle-container'>
                            <div className='evaluation-toggle' onClick={() => {
                                setShowEvaluation(!showEvaluation);
                            }}>
                                {!showEvaluation && <>
                                    <span className='icon'>
                                        <i className="fa-solid fa-chevron-down"></i>
                                    </span>
                                </>}
                                {showEvaluation && <>
                                    <span className='icon'>
                                        <i className="fa-solid fa-chevron-up"></i>
                                    </span>
                                </>}
                            </div>
                        </div>
                    </div>
                </div>

                {showEvaluation && <>
                    <div className='section-card gpt-evaluation'>
                        GPT Evaluation: {mostRecentTweet.evaluation}
                    </div>
                </>}
            </div>
        </>}
    </>

    return <>
        <div className='vault-container'>
            <Dashboard></Dashboard>

            {currentMiningTweet}

            <div className={`switch-btn ${isKOL ? 'kol' : ''}`}>
                {isKOL && <>
                    <div className={`option ${miningMode === 'group' ? 'active' : ''}`} onClick={() => {
                        setMiningMode('solo');
                    }}>Solo Mining</div>
                    <div className={`option ${miningMode === 'group' ? '' : 'active'}`} onClick={() => {
                        setMiningMode('group');
                    }}>Group Mining</div>
                </>}

                {!isKOL && <>
                    <div className={`option ${miningMode === 'group' ? '' : 'active'}`} onClick={() => {
                        setMiningMode('group');
                    }}>Group Mining</div>
                    <div className={`option ${miningMode === 'group' ? 'active' : ''}`} onClick={() => {
                        setMiningMode('solo');
                    }}>
                        Solo Mining
                        {/* <Tooltip title="Unlock this feature by upgrading your HNFT">Solo Mining</Tooltip> */}
                    </div>
                </>}

                <div className={`knob ${miningMode}`}></div>
            </div>

            {miningMode === 'solo' && <>
                <div className='miner-title'>Solo Mining</div>
                <div className='miner-description'>
                    GPT evaluates your Tweet (attaching {OFFICIAL_TAG}) based on Originality, Creativity, Practicality, Personality & Discussability and generates a SCORE based on which, you will be earning rewards.
                </div>

                <div className='section-card post-tweet'>
                    <div className='post-info'>Tweet with <span className='hashtag'>{OFFICIAL_TAG}</span> to start mining!</div>
                    <div className='twit-btn action-btn-primary active' onClick={() => {
                        setTweetGeneratorModal(true);
                    }}>Tweet</div>
                </div>
            </>}

            {miningMode === 'group' && <>
                <div className='miner-title'>Group Mining</div>
                <div className='miner-description'>
                    Comment under tweets (attaching {OFFICIAL_TAG}) to boost both yours and the original tweet's SCORE. More quality interaction in a thread means more earnings for everyone engaged.
                </div>

                {leaderTweets && <>
                    {leaderTweets.map(tweet => {
                        return <>
                            <GroupMiningTweet tweet={tweet}></GroupMiningTweet>
                        </>
                    })}
                </>}
            </>}
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
