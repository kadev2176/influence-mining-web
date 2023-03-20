import { Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { useInterval } from '../../hooks/useInterval';
import { getMyIMAccount, getLeaderBoardImAccounts, getPoolSummary, PoolSummary, getAD3Activity, ImAccount } from '../../services/mining.service';
import { fetchOembedTweet } from '../../services/twitter.service';
import { amountToFloatString, formatAd3Amount, formatInfluenceScore, formatTwitterImageUrl } from '../../utils/format.util';
import LeaderBoardTweet from '../LeaderBoardTweet/LeaderBoardTweet';
import './LeaderBoard.scss';

export interface LeaderBoardProps {
    imAccount: ImAccount
}

// const maxTextLength = 70;

// const trimText = (text: string) => {
//     const len = text.replace(/[^\x00-\xff]/g, "01").length;
//     if (len < maxTextLength) {
//         return text;
//     }
//     return text.slice(0, Math.floor(maxTextLength * text.length / len)) + '...';
// }

function LeaderBoard({ imAccount }: LeaderBoardProps) {
    const [poolSummary, setPoolSummary] = useState<PoolSummary>();
    const [leaderboardRows, setLeaderBoardRows] = useState<any[]>();
    const [halveTime, setHalveTime] = useState<string>('-');

    const fetchLeaderBoard = async (imAccount: ImAccount) => {
        const leaders = await getLeaderBoardImAccounts();
        const accounts = [imAccount, ...leaders ?? []];

        const rank = (leaders ?? []).findIndex(account => account.id === imAccount?.id);
        const rows = await Promise.all(accounts.map(async (account, index) => {
            const tweet = account?.tweetId ? await fetchOembedTweet(account?.tweetId) : {};
            return {
                avatar: formatTwitterImageUrl(account?.twitterProfileImageUri),
                influence: account?.influence,
                rank: index > 0
                    ? `${index}`
                    : (rank >= 0 ? `${rank + 1}` : 'Unknown'),
                tweetContent: account.tweetContent,
                ...tweet,
                evaluation: account.tweetEvaluation
            };
        }));
        setLeaderBoardRows(rows);
    }

    useEffect(() => {
        fetchLeaderBoard(imAccount);
    }, [imAccount])

    useEffect(() => {
        getPoolSummary().then((res) => {
            setPoolSummary(res);
        });
        getAD3Activity().then(res => {
            if (res?.halveTime) {
                const diffInSeconds = Number(res.halveTime) - (Date.now() / 1000);
                if (diffInSeconds > 0) {
                    const days = Math.ceil(diffInSeconds / 86400);
                    setHalveTime(`${days} Day${days > 1 ? 's' : ''}`);
                }
            }
        })
    }, []);

    return <>
        <div className='leaderboard-container'>
            <div className='title'>
                ROLLING 24H LEADERBOARD
            </div>

            <div className='dashboard'>
                <div className='stat-card'>
                    <div className='label'>Whole Network Score</div>
                    <div className='value'>{formatInfluenceScore(poolSummary?.totalInfluence ?? '0')}</div>
                </div>

                <div className='stat-card'>
                    <div className='label'>Reward per Block(24h)</div>
                    <div className='value'>{Number(amountToFloatString(poolSummary?.currentDailyOutput ?? '0')).toLocaleString('en-US')} $AD3</div>
                </div>

                <div className='stat-card'>
                    <div className='label'>Next Halving</div>
                    <div className='value'>{halveTime}</div>
                </div>
            </div>

            <div className='leaderboard-tweets'>
                <Row className='leaderboard-header'>
                    <Col span={2}>Position</Col>
                    <Col span={19}>User</Col>
                    <Col span={1}>Boost</Col>
                    <Col span={2}>Score</Col>
                </Row>
                {/* <div className='leaderboard-header'>
                    <span>Position</span>
                    <span>User</span>
                    <span>Boost</span>
                    <span>Score</span>
                </div> */}
                
                {leaderboardRows && leaderboardRows.length > 0 && <>
                    {leaderboardRows.map((tweet, index) => {
                        return <LeaderBoardTweet tweet={tweet} isOwner={!index}></LeaderBoardTweet>
                    })}
                </>}
            </div>

            {/* <div className='leaderboard-table-container'>
                <table className='leaderboard-table'>
                    <thead>
                        <tr>
                            <th>Position</th>
                            <th>User</th>
                            <th>Boost</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboardRows && leaderboardRows.length > 0 && <>
                            {leaderboardRows.map((row, index) => {
                                return <tr className={index ? '' : 'tr-user'} key={index}>
                                    <td>{row.rank}</td>
                                    <td>
                                        <LeaderBoardTweet tweet={row} />
                                    </td>
                                    <td>1 x</td>
                                    <td>{formatInfluenceScore(row.influence)}</td>
                                </tr>
                            })}
                        </>}
                    </tbody>
                </table>
            </div> */}
        </div>
    </>;
};

export default LeaderBoard;
