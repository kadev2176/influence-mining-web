import { useLocation, useNavigate } from 'react-router-dom';
import { useImAccount } from '../../hooks/useImAccount';
import './HomePageHeader.scss';
import { BrowserView, MobileView } from 'react-device-detect';
import { Dropdown } from 'antd';

export interface HomePageHeaderProps { }

function HomePageHeader({ }: HomePageHeaderProps) {
    const navigate = useNavigate();
    const location = useLocation();

    const openWhitepaper = () => {
        window.open('https://parami.gitbook.io/gpt-miner/');
    }

    const { imAccount } = useImAccount();

    return <>
        <div className='header-container'>
            {/* <div className='logo'>
            </div> */}
            <BrowserView className='menu'>
                <Dropdown dropdownRender={() => {
                    return <>
                        <div className='links-dropdown'>
                            <div className='link' onClick={openWhitepaper}>Wallet</div>
                            <div className='link' onClick={openWhitepaper}>Swap</div>
                            <div className='link' onClick={openWhitepaper}>Staking</div>
                            <div className='link' onClick={openWhitepaper}>hNFT</div>
                            <div className='link' onClick={openWhitepaper}>Bid War</div>
                        </div>
                    </>
                }}>
                    <div className='menu-btn'>
                        <div className='text'>Explore Apps</div>
                        <i className="fa-solid fa-chevron-down"></i>
                    </div>
                </Dropdown>
            </BrowserView>

            <BrowserView className='links'>
                <div className='link' onClick={openWhitepaper}>Whitepaper</div>
            </BrowserView>
            <MobileView className='links-mobile'>
                <Dropdown dropdownRender={() => {
                    return <>
                        <div className='links-dropdown'>
                            <div className='link' onClick={openWhitepaper}>Wallet</div>
                            <div className='link' onClick={openWhitepaper}>Swap</div>
                            <div className='link' onClick={openWhitepaper}>Staking</div>
                            <div className='link' onClick={openWhitepaper}>hNFT</div>
                            <div className='link' onClick={openWhitepaper}>Bid War</div>
                            <div className='link' onClick={openWhitepaper}>Whitepaper</div>
                        </div>
                    </>
                }}>
                    <div className='links-dropdown-btn'>
                        <i className="fa-solid fa-chevron-down"></i>
                    </div>
                </Dropdown>
            </MobileView>

            <div className='connect-wallet'>
                {location.pathname !== '/vault' && <>
                    <div className='connect-btn action-btn active' onClick={() => {
                        navigate('/auth');
                    }}>
                        Launch App
                    </div>
                </>}

                {location.pathname === '/vault' && <>
                    {imAccount && <>
                        <Dropdown dropdownRender={() => {
                            return <>
                                <div className='user-profile-dropdown'>
                                    <div className='logout-btn' onClick={() => {
                                        window.localStorage.removeItem('authcookiebytwitter');
                                        window.localStorage.removeItem('expiretime');
                                        window.localStorage.removeItem('userid');
                                        navigate('/auth');
                                    }}>logout</div>
                                </div>
                            </>
                        }}>
                            <div className='user-profile'>
                                {imAccount && <>
                                    <img src={imAccount.twitterProfileImageUri} referrerPolicy="no-referrer" className='pfp'></img>
                                    {!!imAccount.twitterName && <>
                                        <span className='user-name'>
                                            {`@${imAccount.twitterName}`}
                                        </span>
                                    </>}
                                </>}
                            </div>
                        </Dropdown>
                    </>}
                </>}
            </div>
        </div>
    </>;
};

export default HomePageHeader;
