import React, { useState } from 'react';
import { OembedTweet } from '../../services/twitter.service';
import './LeaderBoardTweet.scss';

export interface LeaderBoardTweetProps {
    tweet: OembedTweet & { evaluation: string; avatar: string }
}

const maxTextLength = 70;

const trimText = (text: string) => {
    const len = text.replace(/[^\x00-\xff]/g, "01").length;
    if (len < maxTextLength) {
        return text;
    }
    return text.slice(0, Math.floor(maxTextLength * text.length / len)) + '...';
}

function LeaderBoardTweet({ tweet }: LeaderBoardTweetProps) {
    const [showEvaluation, setShowEvaluation] = useState<boolean>(false);

    return <>
        <div className='tweet-container'>
            {tweet.tweetUrl && <>
                <div className='tweet active'>
                    {!!tweet.avatar && <>
                        <img src={tweet.avatar} className='avatar' referrerPolicy="no-referrer" onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(tweet.authorUrl);
                        }}></img>
                    </>}
                    <div className='content'>
                        <span className='author' onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(tweet.authorUrl);
                        }}>@{tweet.authorName}: </span>

                        <span className='text' onClick={() => {
                            window.open(tweet.tweetUrl);
                        }}>
                            {trimText(tweet.tweetContent)}
                        </span>

                        {tweet.evaluation && <>
                            <span className='evaluation-btn' onClick={() => {
                                setShowEvaluation(!showEvaluation);
                            }}>
                                <span className='label'>GPT Evaluation</span>
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
                            </span>
                        </>}
                    </div>
                </div>
                {showEvaluation && <>
                    <div className='evaluation'>{tweet.evaluation}</div>
                </>}
            </>}
            {!tweet.tweetUrl && <>
                <div className='tweet'>
                    {!!tweet.avatar && <>
                        <img src={tweet.avatar} className='avatar' referrerPolicy="no-referrer"></img>
                    </>}
                    <div className='content'>
                        No GPTMiner tweet at the moment.
                    </div>
                </div>
            </>}
        </div>
    </>;
};

export default LeaderBoardTweet;
