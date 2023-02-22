import React, { useEffect } from 'react';
import { Button, Layout } from 'antd';
import './Home.scss';
import HomePageHeader from '../../components/HomePageHeader/HomePageHeader';
import { Outlet, useLocation } from 'react-router-dom';
import { parseUrlParams } from '../../utils/window.util';

const { Content } = Layout;

export interface HomeProps { }

function Home({ }: HomeProps) {
    const location = useLocation();

    useEffect(() => {
        const params = parseUrlParams();
        if (params.oauth_token && params.oauth_verifier) {
            window.localStorage.setItem('oauth_token', params.oauth_token as string);
            window.localStorage.setItem('oauth_verifier', params.oauth_verifier as string);
            window.close();
        }
    }, []);

    return <>
        {location.pathname === '/auth' && <>
            <Outlet></Outlet>
        </>}
        {location.pathname !== '/auth' && <>
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
