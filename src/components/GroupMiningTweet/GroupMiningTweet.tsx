import React, { useState } from 'react';
import UserAvatar from '../UserAvatar/UserAvatar';
import { OembedTweet } from '../../services/twitter.service';
import './GroupMiningTweet.scss';
import GPTScore from '../GPTScore/GPTScore';
import { formatInfluenceScore } from '../../utils/format.util';
import TweetGeneratorModal from '../TweetGeneratorModal/TweetGeneratorModal';

export interface GroupMiningLeaderTweet extends Partial<OembedTweet> {
    twitterName: string;
    twitterUsername: string;
    twitterProfileImageUri: string;
    influence?: string;
    influenceBonus?: string;
    influenceBoost?: string;
    boost?: string;
    tweetContentScore?: string;
}

export interface GroupMiningTweetProps {
    tweet: GroupMiningLeaderTweet;
}

function GroupMiningTweet({ tweet }: GroupMiningTweetProps) {
    const [replyTweetModal, setReplyTweetModal] = useState<boolean>(false);

    return <>
        <div className='group-mining-tweet section-card' onClick={() => {
            setReplyTweetModal(true);
        }}>
            <div className='avatar-container' onClick={() => {
                // window.open(tweet.authorUrl);
            }}>
                <UserAvatar className='avatar' src={tweet?.twitterProfileImageUri}></UserAvatar>
            </div>
            <div className='tweet-content'>
                <div className='user-row' onClick={() => {
                    // window.open(tweet.authorUrl);
                }}>
                    <div className='user'>
                        <span className='username'>
                            {tweet?.twitterName}
                        </span>
                        <span className='twitter-name'>@{tweet?.twitterUsername}</span>
                    </div>
                    <div className='scores'>
                        <GPTScore label={'Base'} value={`+${formatInfluenceScore(tweet?.tweetContentScore)}`}></GPTScore>
                        <GPTScore label={'Boost'} value={`x${tweet.influenceBoost}`}></GPTScore>
                        <GPTScore label={'Reply'} value={`+${formatInfluenceScore(tweet?.influenceBonus)}`}></GPTScore>
                        <GPTScore label={'Total'} value={`+${formatInfluenceScore(tweet?.influence)}`}></GPTScore>
                    </div>
                </div>
                <div className='content-row' onClick={() => {
                    // window.open(tweet.tweetUrl);
                }}>
                    {tweet.tweetContent}
                </div>
            </div>
        </div>

        {replyTweetModal && <>
            <TweetGeneratorModal tweet={tweet} onCancel={() => {
                setReplyTweetModal(false);
            }}></TweetGeneratorModal>
        </>}

    </>;
};

export default GroupMiningTweet;
