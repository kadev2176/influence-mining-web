import { useEffect, useState, useCallback } from 'react';
// import { useImAccount } from '../../hooks/useImAccount';
import { getLeaderBoardImAccounts, getPoolSummary, PoolSummary, getAD3Activity, queryImAccountPageTest } from '../../services/mining.service';
import { fetchOembedTweet } from '../../services/twitter.service';
import { amountToFloatString, formatInfluenceScore, formatTwitterImageUrl } from '../../utils/format.util';
import LeaderBoardUserCard from '../../components/LeaderBoardUserCard/LeaderBoardUserCard';
import './LeaderBoard.scss';

export interface LeaderBoardProps {
}

function LeaderBoard(_: LeaderBoardProps) {
    const [loading, setLoading] = useState<boolean>(true);
    const [isEnd, setIsEnd] = useState<boolean>(false);
    const [poolSummary, setPoolSummary] = useState<PoolSummary>();
    const [leaderboardRows, setLeaderBoardRows] = useState<any[]>([]);
    const [halveTime, setHalveTime] = useState<string>('-');
    // const { imAccount } = useImAccount();

    useEffect(() => {
        document.title = 'GPT Miner | Leaderboard';
    }, []);

    useEffect(() => {
        queryImAccountPageTest();
    }, []);

    const fetchLeaderBoard = useCallback(async () => {
        setLoading(true);
        const lastEle = leaderboardRows[leaderboardRows.length - 1];
        console.info('lastEle', lastEle);
        const leaders = await getLeaderBoardImAccounts(20, lastEle?.id);
        const rows = await Promise.all((leaders || []).map(async (account, index) => {
            const tweet = account?.tweetId ? await fetchOembedTweet(account?.tweetId) : {};
            return {
                ...account,
                avatar: formatTwitterImageUrl(account?.twitterProfileImageUri),
                influence: account?.influence,
                rank: index + 1,
                tweetContent: account.tweetContent,
                authorName: account.twitterName,
                ...tweet,
                evaluation: account.tweetEvaluation
            };
        }));

        if (rows?.length) {
            setLeaderBoardRows(old => [...old, ...rows]);
        } else {
            setIsEnd(true);
        }
        setLoading(false);
    }, [leaderboardRows])

    useEffect(() => {
        fetchLeaderBoard();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
            <p className='introduce'>
                Turn into a mining node by tweeting and use your social influence to earn revenue. Fans can buy NFTs of social influencers to earn revenue share. Advertisers can buy ad space with tokens
            </p>

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
                {leaderboardRows && leaderboardRows.length > 0 && <>
                    {leaderboardRows.map((tweet, index) => (
                        <div className={`leaderboard-tweet${index < 4 ? ` item-${index}` : ''}`} key={index}>
                            <LeaderBoardUserCard tweet={tweet} size={index === 0 ? 'large' : 'default'}></LeaderBoardUserCard>
                        </div>
                    ))}
                    <div className='loading-box'>
                        {isEnd ? <p>In the end, there is no more</p> : <button
                            disabled={isEnd || loading}
                            onClick={fetchLeaderBoard}
                        >{`Load${loading ? 'ing' : ' more'}`}</button>}
                    </div>
                </>}
            </div>
        </div>
    </>;
};

export default LeaderBoard;
