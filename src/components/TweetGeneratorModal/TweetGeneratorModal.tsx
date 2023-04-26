import { Modal, Tooltip } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { generateReplyTweetContent, generateTweetContent, getSponsoredTags } from '../../services/twitter.service';
import LoadingBar from '../LoadingBar/LoadingBar';
import MobileDrawer from '../MobileDrawer/MobileDrawer';
import './TweetGeneratorModal.scss';
import { GroupMiningLeaderTweet } from '../GroupMiningTweet/GroupMiningTweet';
import { OFFICIAL_TAG } from '../../models/parami';
import { useSearchParams } from 'react-router-dom';

export interface TweetGeneratorModalProps {
    onCancel: () => void;
    tweet?: GroupMiningLeaderTweet;
    tag?: string;
}

const NONE_TAG = 'none';

const addTag = (content: string, tag: string) => {
    if (!content.includes(tag)) {
        return `${content} ${tag}`;
    }
    return content;
}

function TweetGeneratorModal({ onCancel, tweet, tag }: TweetGeneratorModalProps) {
    const [tweetContent, setTweetContent] = useState<string>(OFFICIAL_TAG);
    const [loading, setLoading] = useState<boolean>();
    const [sponsoredTags, setSponsoredTags] = useState<string[]>([]);
    const [selectedTag, setSelectedTag] = useState<string | undefined>(tag);
    const isReply = !!tweet;
    const [params] = useSearchParams();

    useEffect(() => {
        if (params && sponsoredTags?.length) {
            const tag = params.get('tag');
            if (tag) {
                const preSelectedTag = sponsoredTags.find(sponsoredTag => sponsoredTag.toLocaleLowerCase() === tag.toLocaleLowerCase())
                if (preSelectedTag) {
                    setSelectedTag(preSelectedTag);
                }
            }
        }
    }, [params, sponsoredTags])

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
            let content = addTag(tweetContent, `#${selectedTag}`);
            content = addTag(content, OFFICIAL_TAG);
            setTweetContent(content);
        }
    }, [selectedTag]);

    const sponsoredTopics = <>
        {!isReply && <>
            <div className='label'>
                Sponsored Topics
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
                            key={`key-${tag}`}
                            onClick={() => {
                                setSelectedTag(tag);
                            }}
                        >
                            #{tag}
                            <img className='gift-icon' src='/assets/images/gift.png'></img>
                        </div>
                    </>
                })}
            </div>
        </>}
    </>

    const gptGeneration = <>
        <div className='label tweet-label'>
            Tweet
            <div className='gpt-generator-btn' onClick={() => {
                setLoading(true);
                generateTweetContent(selectedTag).then(tweet => {
                    if (selectedTag) {
                        tweet = addTag(tweet, selectedTag);
                    }
                    tweet = addTag(tweet, OFFICIAL_TAG);
                    setTweetContent(tweet);
                    setLoading(false);
                })
            }}>Use Tweet Generator</div>
        </div>
        {loading && <>
            <div className='loading-section'>
                <LoadingBar></LoadingBar>
                <div className='loading-info'>
                    GPTMiner generates customized tweets for you based on your historical content
                </div>
            </div>
        </>}
        {!loading && <>
            <div className='editor'>
                <TextArea value={tweetContent} placeholder="GPT is generating a tweet for you..." onChange={(e) => {
                    setTweetContent(e.target.value);
                }} />
            </div>
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
