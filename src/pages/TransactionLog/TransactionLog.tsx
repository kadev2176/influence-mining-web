import React, { useEffect, useState } from 'react';
import './TransactionLog.scss';
import { Ad3Tx, WithdrawAd3Signature, getAd3Transactions, getWithdrawSignatureOfTxId } from '../../services/mining.service';
import { useAccount, useNetwork } from 'wagmi';
import LoadingBar from '../../components/LoadingBar/LoadingBar';
import dayjs from 'dayjs';
import { amountToFloatString, formatAd3Amount } from '../../utils/format.util';
import { useCheckWithdrawNonceUsed } from '../../hooks/useCheckWithdrawNonceUsed';
import { useWithdrawAD3 } from '../../hooks/useWithdrawAD3';
import { useNavigate } from 'react-router-dom';

interface TxRecord extends Ad3Tx {
    withdrawSig: WithdrawAd3Signature | null;
    canClaim: boolean
}

export interface TransactionLogProps { }

function TransactionLog({ }: TransactionLogProps) {
    const [transactions, setTransactions] = useState<TxRecord[]>();
    const { isNonceUsed } = useCheckWithdrawNonceUsed();
    const [loading, setLoading] = useState<boolean>(false);
    const [withdrawSig, setWithdrawSig] = useState<WithdrawAd3Signature>();
    const { withdraw, isError, isLoading, isSuccess } = useWithdrawAD3(withdrawSig?.amount, withdrawSig?.nounce, withdrawSig?.sig);
    const navigate = useNavigate();

    useEffect(() => {
        if (isError) {
            setLoading(false);
            setWithdrawSig(undefined);
        }
    }, [isError])

    useEffect(() => {
        if (withdrawSig) {
            withdraw?.();
        }
    }, [withdrawSig])

    useEffect(() => {
        if (isSuccess) {
            setLoading(false);
            setWithdrawSig(undefined);
            fetchTxRecords();
        }
    }, [isSuccess])

    const fetchTxRecords = async () => {
        setTransactions(undefined);
        const txs = await getAd3Transactions();
        const records = await Promise.all(txs.map(async tx => {
            const withdrawSig = await getWithdrawSignatureOfTxId(tx.id);
            const nonceUsed = withdrawSig?.nounce ? await isNonceUsed!(withdrawSig.nounce) : false;
            return {
                ...tx,
                withdrawSig: withdrawSig,
                canClaim: !nonceUsed
            }
        }))
        setTransactions(records);
    }

    useEffect(() => {
        fetchTxRecords();
    }, []);

    return <>
        <div className='tx-log-page-container'>
            <div className='back-btn-container'>
                <div className='back-btn' onClick={() => {
                    navigate('/miner');
                }}>
                    <i className="fa-solid fa-arrow-left"></i>
                </div>
            </div>

            <div className='title-container'>
                Claim History
            </div>

            <div className='transactions-container'>
                {!transactions && <>
                    <LoadingBar></LoadingBar>
                </>}

                {transactions && transactions.length === 0 && <>
                    <div>No records</div>
                </>}

                {transactions && transactions.length > 0 && <>
                    {transactions.map(tx => {
                        const time = dayjs(tx.timestamp * 1000);
                        return <>
                            <div className='transaction' key={tx.id}>
                                <div className='col amount'>
                                    <div className='label'>Amount ($AD3)</div>
                                    <div className='value'>
                                        {formatAd3Amount(tx.diff)}
                                    </div>
                                </div>
                                <div className='col state'>
                                    <div className='label'>State</div>
                                    <div className='value'>
                                        {!tx.withdrawSig && <>
                                            -
                                        </>}
                                        {tx.withdrawSig && <>
                                            {!tx.canClaim && <>
                                                Claim Success
                                            </>}

                                            {tx.canClaim && <>
                                                <span className='claim-btn' onClick={() => {
                                                    setWithdrawSig(tx.withdrawSig!);
                                                }}>Claim token</span>
                                            </>}
                                        </>}

                                    </div>
                                </div>
                                <div className='col time'>
                                    <div className='label'>Time</div>
                                    <div className='value'>
                                        {time.format('YYYY-MM-DD HH:mm')}
                                    </div>
                                </div>
                            </div>
                        </>
                    })}
                </>}
            </div>
        </div>
    </>;
};

export default TransactionLog;
