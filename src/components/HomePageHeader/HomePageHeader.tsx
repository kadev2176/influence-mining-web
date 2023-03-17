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
            <div className='logo-container' onClick={() => {
                navigate('/');
            }}>
                <img className='logo' src='/logo_white_round.png'></img>
                <span className='title'>GPTMiner</span>
            </div>

            {location.pathname === '/vault' && <>
                <Dropdown dropdownRender={() => {
                    return <>
                        <div className='user-profile-dropdown'>
                            <div className='item' onClick={openWhitepaper}>Whitepaper</div>
                            <div className='item disabled'>Whitelist</div>
                            <div className='item' onClick={() => {
                                window.localStorage.removeItem('authcookiebytwitter');
                                window.localStorage.removeItem('expiretime');
                                window.localStorage.removeItem('userid');
                                navigate('/auth');
                            }}>Sign out</div>
                        </div>
                    </>
                }}>
                    <div className='user-profile'>
                        {imAccount && <>
                            <div className='username'>
                                {`${imAccount.twitterName}`}
                            </div>
                            <img className='user-avatar' src={imAccount.twitterProfileImageUri} referrerPolicy="no-referrer"></img>
                        </>}
                    </div>
                </Dropdown>
            </>}

            {location.pathname !== '/vault' && <>
                <div className='launch-btn action-btn-primary active' onClick={() => {
                    navigate('/auth');
                }}>
                    <div className='launch-btn-icon'>
                        <i className="fa-solid fa-arrow-right"></i>
                    </div>
                    Launch App
                </div>
            </>}


        </div>
    </>;
};

export default HomePageHeader;
