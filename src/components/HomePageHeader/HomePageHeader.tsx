import { useLocation, useNavigate } from 'react-router-dom';
import { useImAccount } from '../../hooks/useImAccount';
import './HomePageHeader.scss';
import { LoadingOutlined } from '@ant-design/icons';

export interface HomePageHeaderProps { }

function HomePageHeader({ }: HomePageHeaderProps) {
    const navigate = useNavigate();
    const { imAccount, loading } = useImAccount();
    const location = useLocation();

    return <>
        <div className='header-container'>
            <div className='logo'>
            </div>
            <div className='connect-wallet'>
                {location.pathname !== '/vault' && <>
                    <div className='connect-btn action-btn active' onClick={() => {
                        navigate('/auth');
                    }}>
                        Launch App
                    </div>
                </>}

                {/* {location.pathname === '/vault' && <>
                    {loading && <>
                        <div className='connect-btn action-btn'>
                            <LoadingOutlined spin />
                        </div>
                    </>}

                    {!loading && <>
                        {!!imAccount?.updatedTime && <>
                            <div className='user-profile' onClick={() => {
                                navigate('/vault');
                            }}>
                                <img src={imAccount.twitterProfileImageUri} referrerPolicy="no-referrer" className='pfp'></img>
                                <span className='wallet-address'>
                                    {imAccount.wallet}
                                </span>
                            </div>
                        </>}
                    </>}
                </>} */}
            </div>
        </div>
    </>;
};

export default HomePageHeader;
