import React, { useEffect } from 'react';
import { Button, Layout, notification } from 'antd';
import './Home.scss';
import HomePageHeader from '../../components/HomePageHeader/HomePageHeader';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { parseUrlParams } from '../../utils/window.util';
import { createAccountOrLogin } from '../../services/mining.service';
import MyNFT from '../../components/MyNFT/MyNFT';

const { Content } = Layout;

export interface HomeProps { }

function Home({ }: HomeProps) {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = parseUrlParams() as { code: string };
        if (params.code) {
            createAccountOrLogin(params.code).then(res => {
                if (res.success) {
                    notification.success({
                        message: 'Login Successful!'
                    })
                    navigate('/miner');
                    return;
                }

                if (res.status === 403) {
                    notification.warning({
                        message: 'Please Apply for Beta Access'
                    });
                    setTimeout(() => {
                        navigate('/');
                    }, 1000);
                    return;
                }

                notification.warning({
                    message: res.message
                });
            });
        }
    }, []);

    return <>
        <Layout>
            <HomePageHeader />
            {/* <MyNFT></MyNFT> */}
            <Content className='layout-content-container'>
                <Outlet></Outlet>
            </Content>
        </Layout>
    </>;
};

export default Home;
