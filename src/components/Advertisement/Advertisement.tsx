import React from 'react';
import { notification } from 'antd';
import './Advertisement.scss';
import { LeaderTweet } from '../LeaderBoardUserCard/LeaderBoardUserCard';
import UserAvatar from '../UserAvatar/UserAvatar';

interface AdvertisementProps {
  ad: {
    type?: string;
  };
  userDid?: string;
  avatar?: string;
  tweet: LeaderTweet;
}

const Advertisement: React.FC<AdvertisementProps> = (props) => {
  const { ad, tweet } = props || {};

  const handleComingSoon = () => {
    notification.info({
      message: 'Coming Soon',
    });
  };

  return (
    <div className='advertisement-container'>
      {!ad?.type && (
        <div className='sponsor-info'>
          <div className='sponsor-header'>
            <UserAvatar src={tweet?.avatar} className='avatar' />
            <div className='sponsor-desc'>
              <span>is sponsoring this hNFT. </span>
              <a className='bidLink' href='wwww.baidu.com' target='_blank'>
                Bid on this ad space
              </a>
            </div>
          </div>
          <div className='ad-section'>
            <div className='ad-section-arrow'></div>
            <div className='ad-header'>View Ads. Get Paid.#Twitter</div>
            <div
              className='ad-content'
              style={{
                backgroundImage: 'url(/assets/images/rare_wall_bg.png)',
              }}
            >
              <div className='ad-description'>
                <div className='info-text'>You will be rewarded</div>
                <div className='reward-amount'>
                  <UserAvatar src={tweet?.avatar} className='avatar' />
                  <div className='reward-info'>
                    <span className='reward-number'>300.00</span>
                    <span className='reward-token'>XXX NFT Power</span>
                  </div>
                </div>
                <div className='footer'>
                  <div
                    className='action-button left ad-button'
                    onClick={handleComingSoon}
                  >
                    Claim
                  </div>
                  <div
                    className='action-button right ad-button'
                    onClick={handleComingSoon}
                  >
                    Claim&Learn more
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!!ad?.type && (
        <div className='bid-section'>
          <div className='user-info'>
            <UserAvatar src={tweet?.avatar} className='avatar' />
            <div className='dao-info'>
              <div className='dao-info-text'>
                <div className='user-name' title={tweet?.authorName}>
                  {tweet?.authorName}
                </div>
                <div className='price'>~11.16 AD3</div>
              </div>
              <div className='token-price'>
                <div className='number'>8 holders</div>
                <div className='change flat'>+0.00%</div>
              </div>
            </div>
          </div>
          <div className='content'>
            <div className='help'>
              0xzhaozhao hNFT is available to be hyperlinked...
            </div>
            <div className='footer'>
              <div className='action-button left' onClick={handleComingSoon}>
                Place an Ad
              </div>
              <div className='action-button right' onClick={handleComingSoon}>
                Buy more
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Advertisement;
