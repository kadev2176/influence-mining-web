import React from 'react';
import { Layout } from 'antd';
import './Home.scss';
import Background from '../../components/Background/Background';

const { Header, Footer, Sider, Content } = Layout;

export interface HomeProps { }

function Home({ }: HomeProps) {
    return <>
        <Background></Background>
    </>;
};

export default Home;
