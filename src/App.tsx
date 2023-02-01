import React, { useEffect } from 'react';
import './App.scss';
import { Layout, Menu } from 'antd';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'
import { Link, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { getInfluence } from './services/mining.service';
import { parseUrlParams } from './utils/url.util';

const { Header, Content, Sider } = Layout;

const menuItems = [
  {
    key: 'profile',
    name: 'Profile',
    path: '/profile',
    icon: <>
      <i className="fa-solid fa-user"></i>
    </>,
    label: <>
      <Link to={'/profile'}>Profile</Link>
    </>
  },
  {
    key: 'ad3Tx',
    name: 'Transactions',
    path: '/ad3Tx',
    icon: <><i className="fa-solid fa-money-check-dollar"></i></>,
    label: <>
      <Link to={'/ad3Tx'}>Transactions</Link>
    </>
  },
  {
    key: 'influenceTx',
    name: 'Influence',
    path: '/influenceTx',
    icon: <><i className="fa-solid fa-tower-broadcast"></i></>,
    label: <>
      <Link to={'/influenceTx'}>Influence</Link>
    </>
  },
  {
    key: 'market',
    name: 'Market',
    path: '/market',
    icon: <><i className="fa-solid fa-store"></i></>,
    label: <>
      <Link to={'/market'}>Market</Link>
    </>
  }
];

function App() {
  const { isConnected, address } = useAccount();
  const navigate = useNavigate();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('referer')) {
      window.localStorage.setItem('referer', searchParams.get('referer') as string);
    }
  }, [searchParams])

  useEffect(() => {
    const params = parseUrlParams();
    if (params.oauth_token && params.oauth_verifier) {
      window.localStorage.setItem('oauth_token', params.oauth_token as string);
      window.localStorage.setItem('oauth_verifier', params.oauth_verifier as string);
      window.close();
    }
  }, []);

  useEffect(() => {
    if (!isConnected) {
      navigate('/auth');
    }
  }, [isConnected]);

  useEffect(() => {
    if (address && chain?.id) {
      getInfluence(address!, chain.id).then(influence => {
        if (!influence?.updatedTime) {
          navigate('/auth');
        } else if (location.pathname === '/') {
          navigate('/profile');
        }
      })
    }
  }, [address, chain])

  // only testnet for now
  useEffect(() => {
    if (chain?.id && chain.id !== 5) {
      switchNetwork?.(5);
    }
  }, [chain])

  return (
    <>
      {location.pathname === '/auth' && <>
        <Outlet></Outlet>
      </>}
      {location.pathname !== '/auth' && <>
        <Layout>
          <Header className="header">
            <div className='logo'>
              <img src="/logo-text.svg" style={{ width: '100%' }}></img>
            </div>
          </Header>
          <Layout>
            <Sider width={180} breakpoint='lg' trigger={null} collapsedWidth="0">
              <Menu
                mode="inline"
                className="sider-menu"
                defaultSelectedKeys={[location.pathname.slice(1)]}
                style={{ height: '100%', borderRight: 0 }}
                items={menuItems}
              />
            </Sider>
            <Layout>
              <Content
                className='layout-content'
              >
                <Outlet></Outlet>
              </Content>

              <div className='bottom-menu'>
                {menuItems.map(item => {
                  return <>
                    <Link to={item.path} key={item.key}>
                      <div className={`bottom-menu-item ${location.pathname === item.path ? 'active' : ''}`}>
                        <div className='icon'>
                          {item.icon}
                        </div>
                        <div className='label'>
                          {item.name}
                        </div>
                      </div>
                    </Link>
                  </>
                })}
              </div>
            </Layout>
          </Layout>
        </Layout>
      </>}

    </>


  );
}

export default App;
