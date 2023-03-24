import { Modal } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { generateTweetContent } from '../../services/twitter.service';
import { LeaderTweet } from '../LeaderBoardTweet/LeaderBoardTweet';
import './TweetGeneratorModal.scss';

export interface TweetGeneratorModalProps {
    onCancel: () => void;
    tweet?: LeaderTweet
}

function TweetGeneratorModal({ onCancel, tweet }: TweetGeneratorModalProps) {
    const [tweetContent, setTweetContent] = useState<string>('');

    useEffect(() => {
        generateTweetContent().then(content => {
            setTweetContent(content);
        });
    }, []);

    const postTweet = () => {
        if (isMobile) {
            window.open(`twitter://post?message=${encodeURIComponent(tweetContent)}${tweet ? `&in_reply_to=${tweet.tweetId}` : ''}}`);
            return;
        }
    
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetContent)}${tweet ? `&in_reply_to=${tweet.tweetId}` : ''}`);
    }

    return <>
        <Modal
            className='tweet-generator'
            open
            title=""
            onCancel={() => { onCancel() }}
            footer={null}
            width={950}
        >
            <div className='generator-container'>
                <div className='label'>GPT generated</div>
                <div className='editor'>
                    <TextArea value={tweetContent} placeholder="GPT is generating a tweet for you..." onChange={(e) => {
                        setTweetContent(e.target.value);
                    }} />
                </div>
            </div>
            <div className='modal-footer'>
                <div className='action-btn-primary active' onClick={() => {
                    postTweet();
                }}>
                    <div>
                        <span className='icon'>
                            <i className="fa-brands fa-twitter"></i>
                        </span>
                        Tweet
                    </div>
                </div>
            </div>
        </Modal>
    </>;
};

export default TweetGeneratorModal;
