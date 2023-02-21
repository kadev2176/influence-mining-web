import { Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { getIMAccountOfBillboard, getIMAccountOfWallet, getLeaderBoardImAccounts, getPoolSummary, PoolSummary } from '../../services/mining.service';
import { fetchOembedTweet } from '../../services/twitter.service';
import { formatAd3Amount, formatInfluenceScore, formatTwitterImageUrl } from '../../utils/format.util';
import './LeaderBoard.scss';

export interface LeaderBoardProps { }

const mockTweetIds = ['1627871192869916675', '1627914237099089923', '1627505019074543617', '1627246535581761536', '1627257688240316420', '1627869830723563521', '1627714427586740227', '1625449841991065601', '1627296482570420224', '1615707890903293952', '1627604615511396352', '1627871192869916675', '1627505019074543617', '1627246535581761536', '1627257688240316420', '1627869830723563521', '1627714427586740227', '1625449841991065601', '1627296482570420224', '1615707890903293952', '1627604615511396352'];

const trimText = (text: string) => {
    const len = text.replace(/[^\x00-\xff]/g,"01").length;
    if (len < 120) {
        return text;
    }
    return text.slice(0, Math.floor(120 * text.length / len)) + '...';
}

function LeaderBoard({ }: LeaderBoardProps) {
    const [poolSummary, setPoolSummary] = useState<PoolSummary>();
    const { address } = useAccount();
    const { chain } = useNetwork();
    const [leaderboardRows, setLeaderBoardRows] = useState<any[]>();

    useEffect(() => {
        if (address) {
            getPoolSummary(address).then((res) => {
                setPoolSummary(res);
            })
        }
    }, [address]);

    const fetchLeaderBoard = async (address: string, chainId: number) => {
        const user = await getIMAccountOfWallet(address, chainId);
        const leaders = await getLeaderBoardImAccounts(address, chainId);
        const accounts = [user, ...leaders ?? []];
        const rows = await Promise.all(accounts.map(async (account, index) => {
            const tweetId = mockTweetIds[index];
            const tweet = await fetchOembedTweet(tweetId);
            return {
                avatar: formatTwitterImageUrl(account?.twitterProfileImageUri),
                influence: account?.influence,
                ...tweet
            };
        }));
        setLeaderBoardRows(rows);
    }

    useEffect(() => {
        if (address && chain) {
            fetchLeaderBoard(address, chain.id);
        }
    }, [address, chain])

    // useEffect(() => {
    //     fetchOembedTweet('1234903157580296192').then(tweet => {
    //         console.log('got tweet', tweet);
    //     });
    // }, [])

    return <>
        <div className='leaderboard-container'>
            <div className='title'>
                ROLLING 24H LEADERBOARD
            </div>
            <div className='description'>
                <div className='info'>
                    We use <span className='label'>ChatGPT</span> to evaluate your twitter mining influence, which considers factors such as twitter account rating, mining twitter content, interaction, likes and comments and other data.
                    <a className='link'>Click here for details.</a>
                </div>
                <div className='sub-title'>Update per 5 mins</div>
            </div>

            <div className='dashboard'>
                <div className='row'>
                    <div className='stat'>
                        <div className='label'>Whole Network Score</div>
                        <div className='value'>{formatInfluenceScore(poolSummary?.totalInfluence ?? '0')}</div>
                    </div>
                </div>

                <div className='row'>
                    <div className='stat'>
                        <div className='label'>Reward per Block(24h)</div>
                        <div className='value'>{formatAd3Amount(poolSummary?.currentDailyOutput ?? '0')} $AD3</div>
                    </div>

                    <div className='stat'>
                        <div className='label'>Next Halving</div>
                        <div className='value'>10 Days</div>
                    </div>
                </div>
            </div>


            <div className='leaderboard-table-container'>
                <table className='leaderboard-table'>
                    <tr>
                        <th>Position</th>
                        <th>Miner</th>
                        <th>Boost</th>
                        <th>Scores</th>
                    </tr>
                    <tbody>
                        {leaderboardRows && leaderboardRows.length > 0 && <>
                            {leaderboardRows.map((row, index) => {
                                return <tr className={index ? '' : 'tr-user'}>
                                    <td>{index ? index : 'Unknown'}</td>
                                    <td>
                                        <div className='tweet'>
                                            <img src={row.avatar} className='avatar' referrerPolicy="no-referrer"></img>
                                            <div className='content'>
                                                <span className='author'>@{row.authorName}: </span>
                                                <span className='text'>
                                                    {trimText(row.tweetContent)}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>1 x</td>
                                    <td>{formatInfluenceScore(row.influence)}</td>
                                </tr>
                                return <>
                                    <Row>
                                        <Col span={3}>{index ? index : 'Unknown'}</Col>
                                        <Col span={15}>
                                            <div className='tweet'>
                                                <img src={row.avatar} className='avatar' referrerPolicy="no-referrer"></img>
                                                <div className='content'>
                                                    <span className='author'>@{row.authorName}: </span>
                                                    {row.tweetContent}
                                                </div>
                                            </div>
                                        </Col>
                                        <Col span={3}>1 x</Col>
                                        <Col span={3}>{formatInfluenceScore(row.influence)}</Col>
                                    </Row>
                                </>
                            })}
                        </>}
                    </tbody>
                </table>
                {/* <Row className='table-head'>
                    <Col span={3}>Position</Col>
                    <Col span={15}>Miner</Col>
                    <Col span={3}>Boost</Col>
                    <Col span={3}>Scores</Col>
                </Row>
                {leaderboardRows && leaderboardRows.length > 0 && <>
                    {leaderboardRows.map((row, index) => {
                        return <>
                            <Row>
                                <Col span={3}>{index ? index : 'Unknown'}</Col>
                                <Col span={15}>
                                    <div className='tweet'>
                                        <img src={row.avatar} className='avatar' referrerPolicy="no-referrer"></img>
                                        <div className='content'>
                                            <span className='author'>@{row.authorName}: </span>
                                            {row.tweetContent}
                                        </div>
                                    </div>
                                </Col>
                                <Col span={3}>1 x</Col>
                                <Col span={3}>{formatInfluenceScore(row.influence)}</Col>
                            </Row>
                        </>
                    })}
                </>} */}
            </div>
        </div>
    </>;
};

export default LeaderBoard;
