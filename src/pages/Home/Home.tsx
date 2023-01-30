import React from 'react';
import { Layout } from 'antd';
import './Home.scss';

const { Header, Footer, Sider, Content } = Layout;

export interface HomeProps { }

function Home({ }: HomeProps) {
    return <>
        <Layout>
            <Header className='page-header'>
                <div className='header-content'>
                    <div className='header-logo'>Logo</div>
                    <div className='header-menu'>
                        <div className='menu-item'>tab 1</div>
                        <div className='menu-item'>tab 2</div>
                        <div className='menu-item'>tab 3</div>
                    </div>
                </div>
            </Header>
            <Content className='page-content'>
                <div className='section overview'>
                    <div className='info'></div>
                    <div className='image'></div>
                </div>
                <div className='section'></div>
                <div className='section'></div>
            </Content>
            <Footer>Parami Foundation</Footer>
        </Layout>
    </>;
};

export default Home;
