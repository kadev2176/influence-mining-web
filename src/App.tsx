import React, { useEffect } from 'react';
import './App.scss';
import { NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import { useAccount, useNetwork } from 'wagmi'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getInfluence } from './services/mining.service';

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
  const { isConnected } = useAccount();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isConnected) {
      navigate('/auth');
    } else if (location.pathname !== '/oauth/twitter') {
      getInfluence(address!, chain!.id).then(influence => {
        if (!influence?.updatedTime) {
          navigate('/auth');
        }
      })
    }
  }, [isConnected])

  const {
    token: { colorBgContainer },
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
