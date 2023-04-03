import { Col, Row } from 'antd';
import React, { useState } from 'react';
import { isMobile } from 'react-device-detect';
import { OembedTweet } from '../../services/twitter.service';
import { formatInfluenceScore } from '../../utils/format.util';
import './LeaderBoardTweet.scss';

export interface LeaderTweet extends Partial<OembedTweet> {
    evaluation: string;
    avatar: string;
    rank: string;
    influence: string;
}
export interface LeaderBoardTweetProps {
    tweet: LeaderTweet,
    isOwner: boolean,
    selectable?: boolean,
    onSelect?: (t: LeaderTweet) => void,
    selected?: boolean
}

const maxTextLength = 70;

const trimText = (text: string) => {
    const len = text.replace(/[^\x00-\xff]/g, "01").length;
    if (len < maxTextLength) {
        return text;
    }
    return text.slice(0, Math.floor(maxTextLength * text.length / len)) + '...';
}

function LeaderBoardTweet({ tweet, isOwner, selectable = false, onSelect, selected }: LeaderBoardTweetProps) {
    const [showEvaluation, setShowEvaluation] = useState<boolean>(false);

    return <>
        <div className={`tweet-container ${selectable ? 'selectable' : ''} ${selected ? 'selected' : ''}`} onClick={() => {
            if (selectable) {
                onSelect && onSelect(tweet);
            }
        }}>
            {isOwner && <>
                <div className='owner-tag'>me</div>
            </>}

            {!isMobile && <>
                <Row className='content-row'>
                    <Col span={2}>
                        <div className='position'>
                            {tweet.rank}
                        </div>
                    </Col>
                    <Col span={5}>
                        <div className='user' onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(tweet.authorUrl);
                        }}>
                            {!!tweet.avatar && <>
                                <img src={tweet.avatar} className='user-avatar' referrerPolicy="no-referrer"></img>
                            </>}
                            <div className='user-name'>@{tweet.authorName}</div>:
                        </div>
                    </Col>
                    <Col span={tweet.evaluation ? 10 : 14}>
                        {!!tweet.tweetContent && <>
                            <div className='tweet-content' onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                window.open(tweet.tweetUrl);
                            }}>
                                {tweet.tweetContent}
                            </div>
                        </>}
                        {!tweet.tweetContent && <>
                            <div className='tweet-content disabled'>No GPTMiner tweet at the moment.</div>
                        </>}
                    </Col>
                    <Col span={tweet.evaluation ? 4 : 0}>
                        {tweet.evaluation && <>
                            <span className='evaluation-btn' onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
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
            </>}

            {isMobile && <>
                <Row className='content-row'>
                    <Col span={2}>
                        <div className='position'>
                            {tweet.rank === 'Unknown' && <>
                                <span className='small'>N/A</span>
                            </>}
                            {tweet.rank !== 'Unknown' && <>
                                {tweet.rank}
                            </>}
                        </div>
                    </Col>
                    <Col span={3}>
                        {!!tweet.avatar && <>
                            <img src={tweet.avatar} className='user-avatar' referrerPolicy="no-referrer"></img>
                        </>}
                    </Col>
                    <Col span={19}>
                        <div className='user-tweet'>
                            <div className='user-name'>@{tweet.authorName}:</div>
                            {!!tweet.tweetContent && <>
                                <div className='tweet-content' onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    window.open(tweet.tweetUrl);
                                }}>
                                    {tweet.tweetContent}
                                </div>
                            </>}
                            {!tweet.tweetContent && <>
                                <div className='tweet-content disabled'>No GPTMiner tweet at the moment.</div>
                            </>}
                        </div>
                    </Col>
                </Row>
                {!!tweet.evaluation && <>
                    <Row className='content-row'>
                        <Col span={2}>
                            {/* empty */}
                        </Col>
                        <Col span={22}>
                            <span className='evaluation-btn' onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
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
                        </Col>
                    </Row>
                    {showEvaluation && <>
                        <div className='evaluation'>
                            <span className='evaluation-tag'>GPT Evaluation:</span>{tweet.evaluation.slice(16)}
                        </div>
                    </>}
                </>}
                <Row className='content-row'>
                    <Col span={2}>
                        <div className='boost'>1X</div>
                    </Col>
                    <Col span={20}>
                        {/* empty */}
                    </Col>
                    <Col span={2}>
                        <div className='score'>{formatInfluenceScore(tweet.influence)}</div>
                    </Col>
                </Row>
            </>}
        </div>
    </>;
};

export default LeaderBoardTweet;
