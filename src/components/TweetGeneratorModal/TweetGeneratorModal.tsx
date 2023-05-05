import { Modal, Tooltip } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { SponsoredTag, generateReplyTweetContent, generateTweetContent, getSponsoredTags } from '../../services/twitter.service';
import LoadingBar from '../LoadingBar/LoadingBar';
import MobileDrawer from '../MobileDrawer/MobileDrawer';
import './TweetGeneratorModal.scss';
import { GroupMiningLeaderTweet } from '../GroupMiningTweet/GroupMiningTweet';
import { OFFICIAL_TAG } from '../../models/parami';
import { useSearchParams } from 'react-router-dom';

export interface TweetGeneratorModalProps {
    onCancel: () => void;
    tweet?: GroupMiningLeaderTweet;
}

const NONE_TAG = 'none';

const addTag = (content: string, tag: string) => {
    if (!content.includes(tag)) {
        return `${content} ${tag}`;
    }
    return content;
}

function TweetGeneratorModal({ onCancel, tweet }: TweetGeneratorModalProps) {
    const [tweetContent, setTweetContent] = useState<string>(OFFICIAL_TAG);
    const [loading, setLoading] = useState<boolean>();
    const [sponsoredTags, setSponsoredTags] = useState<SponsoredTag[]>([]);
    const [selectedTag, setSelectedTag] = useState<SponsoredTag>();
    const isReply = !!tweet;
    const [params] = useSearchParams();

    useEffect(() => {
        if (params && sponsoredTags?.length) {
            const tagOnParam = params.get('tag');
            if (tagOnParam) {
                const preSelectedTag = sponsoredTags.find(sponsoredTag => sponsoredTag.tag.toLocaleLowerCase() === tagOnParam.toLocaleLowerCase())
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
            setTweetContent(`#${selectedTag.tag} ${OFFICIAL_TAG}`)
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
                        <div className={`sponsored-tag ${selectedTag?.tag === tag.tag ? 'selected' : ''}`}
                            key={`key-${tag.tag}`}
                            onClick={() => {
                                setSelectedTag(tag);
                            }}
                        >
                            #{tag.tag}
                        </div>
                    </>
                })}
            </div>
            {!!selectedTag && <>
                <div className='sponsor-info'>EXTRA rewards from
                    <span className='sponsor-link' onClick={() => {
                        window.open(selectedTag.link)
                    }}>
                        {selectedTag.tag}
                        <span className='icon'>
                            <i className="fa-solid fa-arrow-up-right-from-square"></i>
                        </span>
                    </span>
                </div>
                <div className='sponsor-description'>
                    {selectedTag.description}
                </div>
            </>}
        </>}
    </>

    const gptGeneration = <>
        <div className='gpt-generator-btn action-btn-primary active' onClick={() => {
            setLoading(true);
            generateTweetContent(selectedTag?.tag).then(tweet => {
                if (selectedTag) {
                    tweet = addTag(tweet, selectedTag.tag);
                }
                tweet = addTag(tweet, OFFICIAL_TAG);
                setTweetContent(tweet);
                setLoading(false);
            })
        }}>GPT based tweet generation</div>
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
            <div className='sponsor-prompt'>
                <span className='icon'>
                    <i className="fa-solid fa-circle-info"></i>
                </span>
                Sponsored Hashtags 🎁 bear EXTRA rewards. Tweets relevant to the sponsor's project will grant you the prize.
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
