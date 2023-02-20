import React from 'react';
import { Button, Layout } from 'antd';
import './Home.scss';
import Background from '../../components/Background/Background';
import HomePageHeader from '../../components/HomePageHeader/HomePageHeader';
import { Outlet, useLocation } from 'react-router-dom';

const { Header, Footer, Sider, Content } = Layout;

export interface HomeProps { }

const SNS = () => {
    return (
        <div className='snsContainer'>
            <div
                className="snsButtonItem"
                onClick={() => {
                    window.open('https://twitter.com/MetaAstroDAO', '_blank');
                }}
            >
                <span className='snsButtonItemSvg'>
                    <i className="fa-brands fa-twitter"></i>
                </span>
            </div>
            <div
                className="snsButtonItem"
                onClick={() => {
                    window.open('https://discord.gg/hqCRDxjmfK', '_blank');
                }}
            >
                <span className='snsButtonItemSvg'>
                    <i className="fa-brands fa-discord"></i>
                </span>
            </div>
            <div
                className="snsButtonItem"
                onClick={() => {
                    window.open('https://opensea.io/collection/meta-astro-genesis', '_blank');
                }}
            >
                <img
                    src={'/assets/images/opensea.svg'}
                    className="snsButtonItemSvg"
                    alt="opensea"
                />
            </div>
        </div>
    )
}

const Landing = () => {
    const sloganTopArr = 'GPT MINER'.split('');
    const sloganBottomArr = 'JUST BE U'.split('');
    const sloganCopyArr = 'WITH PARAMI FOUNDATION'.split('');

    return <>
        <div className="landingContainer">
            <div className="sloganContainer">
                {/* <p className="sloganTop">
                    {sloganTopArr.map((char, index) => (
                        <span
                            key={index}
                            style={{
                                animationDelay: `${Math.random() * (index + 1)}s`,
                            }}
                        >
                            {char}
                        </span>
                    ))}
                </p>
                <p className="sloganBottom">
                    {sloganBottomArr.map((char, index) => (
                        <span
                            key={index}
                            style={{
                                animationDelay: `${Math.random() * (index + 1)}s`,
                            }}
                        >
                            {char}
                        </span>
                    ))}
                    <span className="superscript">AI</span>
                </p>
                <p className="copy">
                    {sloganCopyArr.map((char, index) => (
                        <span
                            key={index}
                            style={{
                                animationDelay: `${Math.random() * (index + 1)}s`,
                            }}
                        >
                            {char}
                        </span>
                    ))}
                </p> */}
                {/* <Button
                    type="link"
                    size="large"
                    icon={<ArrowRightOutlined />}
                    onClick={() => {
                        setStoryModal(true);
                    }}
                    className={style.learnMore}
                >
                    Learn More About MetaAstro Phase I<br />- GENESIS OF THE GODS -
                </Button> */}
                {/* <Button type="link" size='large' className='learnMore' >Learn more</Button> */}
            </div>
            {/* <div
                className={style.mouse}
                style={{
                    opacity: PageScroll > 100 ? 0 : 0.5,
                }}
            >
                <RiArrowDownSLine className={style.icon} />
            </div>
            <SNS /> */}
            {/* <SNS></SNS> */}
        </div>
    </>
}

function Home({ }: HomeProps) {
    const location = useLocation();
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
