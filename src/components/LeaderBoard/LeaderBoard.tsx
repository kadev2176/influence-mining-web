import React, { useEffect, useState } from 'react';
import { useInterval } from '../../hooks/useInterval';
import { getMyIMAccount, getLeaderBoardImAccounts, getPoolSummary, PoolSummary, getAD3Activity, ImAccount } from '../../services/mining.service';
import { fetchOembedTweet } from '../../services/twitter.service';
import { amountToFloatString, formatAd3Amount, formatInfluenceScore, formatTwitterImageUrl } from '../../utils/format.util';
import './LeaderBoard.scss';

export interface LeaderBoardProps {
    imAccount: ImAccount
}

const maxTextLength = 70;

const trimText = (text: string) => {
    const len = text.replace(/[^\x00-\xff]/g, "01").length;
    if (len < maxTextLength) {
        return text;
    }
    return text.slice(0, Math.floor(maxTextLength * text.length / len)) + '...';
}

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
                ...tweet
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
            {/* <div className='description'>
                <div className='info'>
                    We use <span className='label'>ChatGPT</span> to evaluate your twitter mining influence, which considers factors such as twitter account rating, mining twitter content, interaction, likes and comments and other data.
                    <a className='link'>Click here for details.</a>
                </div>
                <div className='sub-title'>Updated every 5 minutes</div>
            </div> */}

            <div className='dashboard'>
                <div className='row first'>
                    <div className='stat'>
                        <div className='label'>Whole Network Score</div>
                        <div className='value'>{formatInfluenceScore(poolSummary?.totalInfluence ?? '0')}</div>
                    </div>
                </div>

                <div className='row'>
                    <div className='stat'>
                        <div className='label'>Reward per Block(24h)</div>
                        <div className='value'>{Number(amountToFloatString(poolSummary?.currentDailyOutput ?? '0')).toLocaleString('en-US')} $AD3</div>
                    </div>

                    <div className='stat'>
                        <div className='label'>Next Halving</div>
                        <div className='value'>{halveTime}</div>
                    </div>
                </div>
            </div>


            <div className='leaderboard-table-container'>
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
                                        {row.tweetUrl && <>
                                            <div className='tweet active' onClick={() => {
                                                window.open(row.tweetUrl);
                                            }}>
                                                {!!row.avatar && <>
                                                    <img src={row.avatar} className='avatar' referrerPolicy="no-referrer" onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        window.open(row.authorUrl);
                                                    }}></img>
                                                </>}
                                                <div className='content'>
                                                    <span className='author' onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        window.open(row.authorUrl);
                                                    }}>@{row.authorName}: </span>
                                                    <span className='text'>
                                                        {trimText(row.tweetContent)}
                                                    </span>
                                                </div>
                                            </div>
                                        </>}
                                        {!row.tweetUrl && <>
                                            <div className='tweet'>
                                                {!!row.avatar && <>
                                                    <img src={row.avatar} className='avatar' referrerPolicy="no-referrer"></img>
                                                </>}
                                                <div className='content'>
                                                    No GPTMiner tweet at the moment.
                                                </div>
                                            </div>
                                        </>}
                                    </td>
                                    <td>1 x</td>
                                    <td>{formatInfluenceScore(row.influence)}</td>
                                </tr>
                            })}
                        </>}
                    </tbody>
                </table>
            </div>
        </div>
    </>;
};

export default LeaderBoard;
