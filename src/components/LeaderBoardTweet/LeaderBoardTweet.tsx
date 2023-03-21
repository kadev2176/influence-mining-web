import { Col, Row } from 'antd';
import React, { useState } from 'react';
import { OembedTweet } from '../../services/twitter.service';
import { formatInfluenceScore } from '../../utils/format.util';
import './LeaderBoardTweet.scss';

export interface LeaderBoardTweetProps {
    tweet: OembedTweet & { evaluation: string; avatar: string; rank: string; influence: string },
    isOwner: boolean
}

const maxTextLength = 70;

const trimText = (text: string) => {
    const len = text.replace(/[^\x00-\xff]/g, "01").length;
    if (len < maxTextLength) {
        return text;
    }
    return text.slice(0, Math.floor(maxTextLength * text.length / len)) + '...';
}

function LeaderBoardTweet({ tweet, isOwner }: LeaderBoardTweetProps) {
    const [showEvaluation, setShowEvaluation] = useState<boolean>(false);

    return <>
        <div className='tweet-container'>
            {isOwner && <>
                <div className='owner-tag'>me</div>
            </>}

            <Row className='content-row'>
                <Col span={2}>
                    <div className='position'>{tweet.rank}</div>
                </Col>
                <Col span={5}>
                    <div className='user' onClick={() => {
                        window.open(tweet.authorUrl);
                    }}>
                        {!!tweet.avatar && <>
                            <img src={tweet.avatar} className='user-avatar' referrerPolicy="no-referrer"></img>
                        </>}
                        <div className='user-name'>@{tweet.authorName}</div>:
                    </div>
                </Col>
                <Col span={10}>
                    {!!tweet.tweetContent && <>
                        <div className='tweet-content' onClick={() => {
                            window.open(tweet.tweetUrl);
                        }}>
                            {tweet.tweetContent}
                        </div>
                    </>}
                    {!tweet.tweetContent && <>
                        <div className='tweet-content disabled'>No GPTMiner tweet at the moment.</div>
                    </>}
                </Col>
                <Col span={4}>
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
                </Col>
                <Col span={1} className="col-center-align">
                    <div className='boost'>1X</div>
                </Col>
                <Col span={2} className="col-center-align">
                    <div className='score'>{formatInfluenceScore(tweet.influence)}</div>
                </Col>
            </Row>

            {showEvaluation && <>
                <div className='evaluation'>
                    <span className='evaluation-tag'>GPT Evaluation:</span>{tweet.evaluation.slice(16)}
                </div>
            </>}


            {/* {tweet.tweetUrl && <>
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
            </>} */}
            {/* {!tweet.tweetUrl && <>
                <div className='tweet'>
                    {!!tweet.avatar && <>
                        <img src={tweet.avatar} className='avatar' referrerPolicy="no-referrer"></img>
                    </>}
                    <div className='content'>
                        No GPTMiner tweet at the moment.
                    </div>
                </div>
            </>} */}
        </div>
    </>;
};

export default LeaderBoardTweet;
