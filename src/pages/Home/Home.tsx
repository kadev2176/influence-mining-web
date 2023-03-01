import React, { useEffect } from 'react';
import { Button, Layout } from 'antd';
import './Home.scss';
import HomePageHeader from '../../components/HomePageHeader/HomePageHeader';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { parseUrlParams } from '../../utils/window.util';

const { Content } = Layout;

export interface HomeProps { }

function Home({ }: HomeProps) {
    const location = useLocation();

    useEffect(() => {
        const params = parseUrlParams();
        if (params.oauth_token && params.oauth_verifier) {
            window.location.href = `${window.location.origin}/#/auth?oauth_token=${params.oauth_token}&oauth_verifier=${params.oauth_verifier}`
        }
    }, []);

    return <>
        {location.pathname === '/' && <>
            <Layout>
                <HomePageHeader />
                <Content>
                    <Outlet></Outlet>
                </Content>
            </Layout>
        </>}
        {location.pathname === '/auth' && <>
            <Outlet></Outlet>
        </>}
        {location.pathname === '/vault' && <>
            <Layout>
                <HomePageHeader />
                <Content>
                    <Outlet></Outlet>
                </Content>
            </Layout>
        </>}
    </>;
};

export default Home;
