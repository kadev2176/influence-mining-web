import { Modal, Tooltip } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { generateReplyTweetContent, generateTweetContent, getSponsoredTags } from '../../services/twitter.service';
import { LeaderTweet } from '../LeaderBoardTweet/LeaderBoardTweet';
import LoadingBar from '../LoadingBar/LoadingBar';
import MobileDrawer from '../MobileDrawer/MobileDrawer';
import './TweetGeneratorModal.scss';

export interface TweetGeneratorModalProps {
    onCancel: () => void;
    tweet?: LeaderTweet;
}

const NONE_TAG = 'none';

function TweetGeneratorModal({ onCancel, tweet }: TweetGeneratorModalProps) {
    const [tweetContent, setTweetContent] = useState<string>('');
    const [loading, setLoading] = useState<boolean>();
    const [sponsoredTags, setSponsoredTags] = useState<string[]>([]);
    const [selectedTag, setSelectedTag] = useState<string>();
    const isReply = !!tweet;

    useEffect(() => {
        if (isReply) {
            setLoading(true);
            generateReplyTweetContent(tweet.tweetId!).then(content => {
                setTweetContent(content);
                setLoading(false);
            });
        }

        getSponsoredTags().then(tags => {
            setSponsoredTags(tags);
        });
    }, []);

    const postTweet = () => {
        if (isMobile) {
            window.open(`twitter://post?message=${encodeURIComponent(tweetContent)}${tweet ? `&in_reply_to=${tweet.tweetId}` : ''}}`);
            return;
        }

        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetContent)}${tweet ? `&in_reply_to=${tweet.tweetId}` : ''}`);
    }

    useEffect(() => {
        if (selectedTag) {
            setLoading(true);
            setTweetContent('');
            generateTweetContent(selectedTag === NONE_TAG ? '' : selectedTag).then(content => {
                setTweetContent(content);
                setLoading(false);
            });
        }
    }, [selectedTag]);

    const sponsoredTopics = <>
        {!isReply && <>
            <div className='label'>
                1. Choose a Sponsored Topic
                <Tooltip title={<span className='tooltip-text'>Adding sponsored Hashtag and tweet relevant content will grant you EXTRA mining rewards</span>}>
                    <span className='icon'>
                        <i className="fa-regular fa-circle-question"></i>
                    </span>
                </Tooltip>
            </div>
            <div className='tags-row'>
                {sponsoredTags.map(tag => {
                    return <>
                        <div className={`sponsored-tag ${selectedTag === tag ? 'selected' : ''}`}
                            key={tag}
                            onClick={() => {
                                setSelectedTag(tag);
                            }}
                        >
                            #{tag}
                            <img className='gift-icon' src='/assets/images/gift.png'></img>
                        </div>
                    </>
                })}

                <div className={`sponsored-tag ${selectedTag === NONE_TAG ? 'selected' : ''}`}
                    key={NONE_TAG}
                    onClick={() => {
                        setSelectedTag(NONE_TAG);
                    }}
                >
                    <div className='none-icon'>
                        <i className="fa-solid fa-ban"></i>
                    </div>
                </div>
            </div>
        </>}
    </>

    const gptGeneration = <>
        <div className='label'>{isReply ? '' : '2. '}GPT Generated Tweet</div>
        {!!tweetContent && <>
            <div className='editor'>
                <TextArea value={tweetContent} placeholder="GPT is generating a tweet for you..." onChange={(e) => {
                    setTweetContent(e.target.value);
                }} />
            </div>
        </>}

        {!tweetContent && <>
            {loading && <>
                <div className='loading-section'>
                    <LoadingBar></LoadingBar>
                    <div className='loading-info'>
                        GPTMiner generates customized tweets for you based on your historical content
                    </div>
                </div>
            </>}
            {!loading && <>
                <div className='loading-section'>
                    <div className='loading-info'>
                        Select a tag and GPT will generate a tweet for you.
                    </div>
                </div>
            </>}
        </>}
    </>

    return <>
        {!isMobile && <>
            <Modal
                className='tweet-generator'
                open
                title=""
                onCancel={() => { onCancel() }}
                footer={null}
                width={956}
            >
                <div className='generator-container'>
                    {sponsoredTopics}
                    {gptGeneration}
                </div>
                <div className='modal-footer'>
                    <div className={`action-btn-primary ${tweetContent ? 'active' : 'disabled'}`} onClick={() => {
                        if (tweetContent) {
                            postTweet();
                        }
                    }}>
                        <div>
                            <span className='icon'>
                                <i className="fa-brands fa-twitter"></i>
                            </span>
                            {isReply ? 'Reply' : 'Tweet'}
                        </div>
                    </div>
                </div>
            </Modal>
        </>}

        {isMobile && <>
            <MobileDrawer onClose={onCancel} closable={true}>
                <div className='tweet-generator-drawer'>
                    {sponsoredTopics}
                    {gptGeneration}

                    <div className='btn-container'>
                        <div className={`action-btn-primary ${tweetContent ? 'active' : 'disabled'}`} onClick={() => {
                            if (tweetContent) {
                                postTweet();
                            }
                        }}>
                            <span className='icon'>
                                <i className="fa-brands fa-twitter"></i>
                            </span>
                            {isReply ? 'Reply' : 'Tweet'}
                        </div>
                    </div>
                </div>
            </MobileDrawer>
        </>}
    </>;
};

export default TweetGeneratorModal;
