import React, { useEffect } from 'react';
import './App.scss';
import { NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import { useAccount } from 'wagmi'
import { Link, Outlet, useNavigate, useSearchParams } from 'react-router-dom';

const { Header, Content, Sider } = Layout;

const siderMenuItems = [
  {
    key: 'profile',
    icon: <><UserOutlined /></>,
    label: <>
      <Link to={'/profile'}>Profile</Link>
    </>
  },
  {
    key: 'ad3Tx',
    icon: <><NotificationOutlined /></>,
    label: <>
      <Link to={'/ad3Tx'}>Transactions</Link>
    </>
  },
  {
    key: 'influenceTx',
    icon: <><UserOutlined /></>,
    label: <>
      <Link to={'/influenceTx'}>Influence</Link>
    </>
  }
];

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isConnected } = useAccount();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get('oauth_token') && searchParams.get('oauth_verifier')) {
      window.localStorage.setItem('oauth_token', searchParams.get('oauth_token') as string);
      window.localStorage.setItem('oauth_verifier', searchParams.get('oauth_verifier') as string);
      window.close();
    } else if (!isConnected) {
      navigate('/auth');
    } else {
      navigate('/profile');
    }
  }, [searchParams, isConnected]);

  const {
    token: { colorBgContainer }
  } = theme.useToken();

  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} items={[{ key: '1', label: 'Logo and Name' }]} />
      </Header>
      <Layout>
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['profile']}
            style={{ height: '100%', borderRight: 0 }}
            items={siderMenuItems}
          />
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
            }}
          >
            <Outlet></Outlet>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default App;
