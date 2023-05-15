import { notification } from 'antd';
import React, { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import ClaimAd3Modal from '../../components/ClaimAd3Modal/ClaimAd3Modal';
import { useImAccount } from '../../hooks/useImAccount';
import { useInterval } from '../../hooks/useInterval';
import { Ad3Activity, getAD3Activity, getAd3Balance } from '../../services/mining.service';
import { amountToFloatString } from '../../utils/format.util';
import './Dashboard.scss';
import { isMobile } from 'react-device-detect';
import { useNavigate } from 'react-router-dom';
import { useHNFT } from '../../hooks/useHNFT';

export interface DashboardProps { }

function Dashboard({ }: DashboardProps) {
    const [totalBalance, setTotalBalance] = useState<string>();
    const [ad3Activity, setAd3Activity] = useState<Ad3Activity>();
    const { imAccount } = useImAccount();
    const [profitStep, setProfitStep] = useState<string>('0');
    const [decimals, setDecimals] = useState<number>(2);
    const [claimModal, setClaimModal] = useState<boolean>(false);
    const navigate = useNavigate();
    const hnft = useHNFT();

    useEffect(() => {
        getAd3Balance().then(balance => {
            if (balance) {
                setTotalBalance(amountToFloatString(BigInt(balance.balance) + BigInt(balance.earned)));
            }
        })

        getAD3Activity().then(ad3Activity => {
            if (ad3Activity) {
                setAd3Activity(ad3Activity);
            }
        })
    }, [])

    useEffect(() => {
        if (ad3Activity && imAccount) {
            if (Number(ad3Activity.miningBalance) === 0) {
                return;
            }

            const outputPerSecond = BigInt(ad3Activity.dailyOutput) / BigInt(86400);
            const profitPerSecond = outputPerSecond * BigInt(imAccount.influence) / BigInt(ad3Activity.miningBalance);
            const step = profitPerSecond * BigInt(2);

            if (Number(step) > 0) {
                const decimals = Math.min(18, Math.max(18 - step.toString().length + 2, 2));
                setDecimals(decimals);
                setProfitStep(amountToFloatString(step));
            }
        }
    }, [ad3Activity, imAccount])

    const addBalance = () => {
        if (totalBalance && profitStep) {
            setTotalBalance((Number(totalBalance) + Number(profitStep)).toString());
        }
    }

    useInterval(addBalance, 2000);

    return <>
        <div className='dashboard-container'>
            {isMobile && <>
                <div className='heading'>
                    Dashboard
                </div>
                <div className='heading-description'>
                    Become a mining node by leveraging your social influence to earn revenue. Followers can buy NFTs of social influencers to earn revenue share. Advertisers can buy ad space with tokens.
                </div>
            </>}

            <div className='section-card mining-rewards'>
                <div className='card-title-row'>
                    <div className='title'>My Mining Rewards</div>
                    <div className='tag'>Test Network</div>
                    <div className='tx-log-icon-container'>
                        <div className='tx-log-icon' onClick={() => {
                            navigate('/txLog');
                        }}>
                            <img src='/assets/images/tx-log.svg'></img>
                        </div>
                    </div>
                </div>

                <div className='reward-row'>
                    <div className='value'>
                        {totalBalance !== undefined && <>
                            {(Number(totalBalance) + Number(profitStep)).toString() === '0' && <>
                                0.00
                            </>}
                            {(Number(totalBalance) + Number(profitStep)).toString() !== '0' && <>
                                <CountUp end={Number(totalBalance) + Number(profitStep)} start={Number(totalBalance)} decimals={decimals} delay={0} duration={1}></CountUp>
                            </>}
                        </>}
                    </div>
                    <div className='unit'>$AD3</div>
                </div>

                <div className='action-btn-primary active claim-btn' onClick={() => {
                    if (!hnft.balance) {
                        navigate('/mint')
                    } else {
                        setClaimModal(true)
                    }
                }}>
                    {!!hnft.balance && <>
                        Claim
                    </>}
                    {!hnft.balance && <>
                        Mint HNFT and Claim
                    </>}
                </div>
            </div>


        </div>

        {claimModal && <>
            <ClaimAd3Modal
                onCancel={() => {
                    setClaimModal(false);
                }}
                onSuccess={() => {
                    notification.success({
                        message: 'Claim Success',
                    })
                    setClaimModal(false);
                }}
            ></ClaimAd3Modal>
        </>}
    </>;
};

export default Dashboard;
