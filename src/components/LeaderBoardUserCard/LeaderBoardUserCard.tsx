import React, { useState } from 'react';
import { Popover } from 'antd';
import { isMobile } from 'react-device-detect';
import { OembedTweet } from '../../services/twitter.service';
import { formatInfluenceScore } from '../../utils/format.util';
import UserAvatar from '../UserAvatar/UserAvatar';
import Advertisement from '../Advertisement/Advertisement';
import MobileDrawer from '../MobileDrawer/MobileDrawer';
import './LeaderBoardUserCard.scss';

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
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  const handleOpenDrawer = () => {
    setOpenDrawer(true);
  };

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
  };

  return (
    <div className={`user-card-container ${size}`}>
      {!isMobile && (
        <Popover
          arrow={false}
          overlayInnerStyle={{
            boxShadow: 'none',
            padding: 0,
            backgroundColor: 'transparent',
          }}
          placement='topLeft'
          content={<Advertisement ad={{ type: '123' }} tweet={tweet} />}
        >
          <div className='user-card-container-ad' />
        </Popover>
      )}

      {isMobile && (
        <>
          <div className='user-card-container-ad' onClick={handleOpenDrawer} />
          <MobileDrawer open={openDrawer} closable onClose={handleCloseDrawer}>
            <Advertisement ad={{ type: '123' }} tweet={tweet} />
          </MobileDrawer>
        </>
      )}

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
