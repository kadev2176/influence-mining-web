import { useLocation, useNavigate } from 'react-router-dom';
import { useImAccount } from '../../hooks/useImAccount';
import './HomePageHeader.scss';
import { isMobile } from 'react-device-detect';
import { Dropdown } from 'antd';
import UserAvatar from '../UserAvatar/UserAvatar';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { shortenString } from '../../utils/format.util';
import { useEffect } from 'react';

export interface HomePageHeaderProps { }

const links = [
    {
        label: 'Miner',
        route: '/miner'
    },
    {
        label: 'Leaderboard',
        route: '/leaderboard'
    }
]

function HomePageHeader({ }: HomePageHeaderProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { address } = useAccount();
    const { chain } = useNetwork();
    const { switchNetwork } = useSwitchNetwork();

    useEffect(() => {
        if (chain && switchNetwork && chain.id !== 5) {
            switchNetwork!(5)
        }
    }, [chain, switchNetwork])

    const openWhitepaper = () => {
        window.open('https://parami.gitbook.io/gpt-miner/');
    }

    const { imAccount } = useImAccount();

    return <>
        <div className={`header-container ${isMobile ? 'mobile' : ''}`}>
            <div className='logo-container' onClick={() => {
                navigate('/');
            }}>
                <img className='logo' src='/logo_trans.png'></img>
                <span className='title'>GPTMiner</span>
            </div>

            {location.pathname !== '/' && <>
                {!isMobile && <>
                    <div className='links'>
                        {links.map(link => {
                            return <>
                                <div className={`link ${location.pathname === link.route ? 'active' : ''}`}
                                    key={link.route}
                                    onClick={() => {
                                        navigate(link.route);
                                    }}
                                >{link.label}</div>
                            </>
                        })}
                    </div>

                    <div className='user-info-section'>
                        {!!address && <>
                            <div className='user-profile'>
                                {chain?.id === 5 && <>
                                    <div className='username'>
                                        {shortenString(address, 13)}
                                    </div>
                                </>}
                                {chain?.id !== 5 && <>
                                    <div className='network-warning' onClick={() => {
                                        switchNetwork?.(5)
                                    }}>
                                        Unsupported Network
                                    </div>
                                </>}
                            </div>
                        </>}

                        <Dropdown dropdownRender={() => {
                            return <>
                                <div className='user-profile-dropdown'>
                                    <div className='item' onClick={openWhitepaper}>Whitepaper</div>
                                    <div className='item disabled'>Whitelist</div>
                                    <div className='item' onClick={() => {
                                        window.localStorage.removeItem('authcookiebytwitter');
                                        window.localStorage.removeItem('expiretime');
                                        window.localStorage.removeItem('userid');
                                        navigate('/');
                                    }}>Sign out</div>
                                </div>
                            </>
                        }}>
                            <div className='user-profile'>
                                {imAccount && <>
                                    <div className='username'>
                                        {`${imAccount.twitterName}`}
                                    </div>
                                    <UserAvatar className='user-avatar' src={imAccount.twitterProfileImageUri}></UserAvatar>
                                </>}
                            </div>
                        </Dropdown>
                    </div>
                </>}
            </>}

            {location.pathname === '/' && <>
                <div className='launch-btn action-btn-primary active' onClick={() => {
                    navigate('/miner');
                }}>
                    <div className='launch-btn-icon'>
                        <i className="fa-solid fa-arrow-right"></i>
                    </div>
                    Launch App
                </div>
            </>}
        </div>

        {isMobile && location.pathname !== '/' && <>
            <div className='mobile-menu'>
                {links.map(link => {
                    return <>
                        <div className={`link ${location.pathname === link.route ? 'active' : ''}`}
                            key={link.route}
                            onClick={() => {
                                navigate(link.route);
                            }}
                        >{link.label}</div>
                    </>
                })}

                <Dropdown placement={'topLeft'} dropdownRender={() => {
                    return <>
                        <div className='user-profile-dropdown'>
                            <div className='item' onClick={openWhitepaper}>Whitepaper</div>
                            <div className='item disabled'>Whitelist</div>
                            <div className='item' onClick={() => {
                                window.localStorage.removeItem('authcookiebytwitter');
                                window.localStorage.removeItem('expiretime');
                                window.localStorage.removeItem('userid');
                                navigate('/');
                            }}>Sign out</div>
                        </div>
                    </>
                }}>
                    <div className='user-profile'>
                        {imAccount && <>
                            <UserAvatar className='user-avatar' src={imAccount.twitterProfileImageUri}></UserAvatar>
                        </>}
                    </div>
                </Dropdown>
            </div>
        </>}
    </>;
};

export default HomePageHeader;
