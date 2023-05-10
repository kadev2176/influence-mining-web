import React, { useState } from 'react';
import { OembedTweet } from '../../services/twitter.service';
import { formatInfluenceScore } from '../../utils/format.util';
import UserAvatar from '../UserAvatar/UserAvatar';
import './LeaderBoardUserCard.scss';
import { HnftBadge } from 'hyperlink-nft-badge';

export interface LeaderTweet extends Partial<OembedTweet> {
  evaluation: string;
  avatar: string;
  rank: string;
  influence: string;
}
export interface LeaderBoardUserCardProps {
  tweet: LeaderTweet;
  size?: 'default' | 'large';
  children?: React.ReactNode;
}

const LeaderBoardUserCard = ({
  tweet,
  size = 'default',
  children,
}: LeaderBoardUserCardProps) => {

  return (
    <div className={`user-card-container ${size}`}>
      <div className='user-card-container-ad'>
        <HnftBadge imageurl='123'></HnftBadge>
        {/* <hnft-badge imageurl="some_url"></hnft-badge> */}
      </div>

      <div
        className='user-card-container-box'
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          window.open(tweet.authorUrl);
        }}
      >
        <div className='user-avatar'>
          <UserAvatar src={tweet.avatar} className='avatar' />
        </div>
        <div className='user-name' title={tweet.authorName}>
          {tweet.authorName}
        </div>
      </div>
      <div className='gpt-score'>
        GPT Score: <span>{formatInfluenceScore(tweet.influence)}</span>
      </div>
      {children}
    </div>
  );
};

export default LeaderBoardUserCard;
