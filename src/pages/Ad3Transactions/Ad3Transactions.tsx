import React, { useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi'
import { Ad3Tx, getAd3Transactions, getWithdrawSignatureOfTxId } from '../../services/mining.service';
import { Button, ConfigProvider, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import './Ad3Transactions.scss';
import WithdrawAd3Modal from '../../components/WithdrawAd3Modal/WithdrawAd3Modal';
import { formatAd3Amount } from '../../utils/format.util';
import { useCheckWithdrawNonceUsed } from '../../hooks/useCheckWithdrawNonceUsed';
import { AD3TxType } from '../../models/parami';

const { Title } = Typography;

export interface Ad3TransactionsProps { }

interface TxRow extends Ad3Tx {
    canClaim?: boolean
}

function Ad3Transactions({ }: Ad3TransactionsProps) {
    const { address } = useAccount();
    const { chain } = useNetwork();
    const [transactions, setTransactions] = useState<TxRow[]>();
    const [withdrawTxId, setWithdrawTxId] = useState<string>();
    const { isNonceUsed } = useCheckWithdrawNonceUsed();

    const fetchTx = async (address: string, chainId: number) => {
        const txs = await getAd3Transactions(address, chainId);

        const rows = await Promise.all(txs.map(async tx => {
            if (tx.type === AD3TxType.DEPOSITE_WITHDRAWABLE && Number(tx.diff) < 0) {
                const withdrawInfo = await getWithdrawSignatureOfTxId(tx.id, chain!.id, address!);
                const nonceUsed = await isNonceUsed!(withdrawInfo.nounce);
                return {
                    ...tx,
                    canClaim: !nonceUsed
                }
            }
            return tx;
        }))

        setTransactions(rows);
    }

    useEffect(() => {
        if (address && isNonceUsed) {
            fetchTx(address, chain!.id);
        }
    }, [address]);

    const columns: ColumnsType<TxRow> = [
        {
            title: 'Time',
            key: 'name',
            render: (_, record) => {
                const time = dayjs(record.timestamp * 1000);
                return <>{time.format('YYYY-MM-DD HH:mm:ss')}</>
            }
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Change',
            key: 'diff',
            render: (_, record) => {
                return <>
                    {formatAd3Amount(`${record.diff}`)}

                    {record.type === AD3TxType.DEPOSITE_WITHDRAWABLE && record.canClaim && <>
                        <Button type='primary' onClick={() => {
                            setWithdrawTxId(record.id);
                        }}>Claim</Button>
                    </>}
                </>
            }
        },
    ];

    return <>
        <div className='ad3-txns-container'>
            <Title level={3}>AD3 Transactions</Title>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: '#23103A'
                    }
                }}
            >
                <Table bordered={false} loading={!transactions} dataSource={transactions} columns={columns}></Table>
            </ConfigProvider>
        </div>

        {withdrawTxId && <>
            <WithdrawAd3Modal
                withdrawTxId={withdrawTxId}
                onCancel={() => {
                    setWithdrawTxId('');
                }}
                onSuccess={() => {
                    setWithdrawTxId('');
                    fetchTx(address!, chain!.id);
                }}
            ></WithdrawAd3Modal>
        </>}
    </>;
};

export default Ad3Transactions;
