import React, { useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi'
import { Ad3Tx, getAd3Transactions } from '../../services/mining.service';
import { Button, ConfigProvider, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import './Ad3Transactions.scss';
import WithdrawAd3Modal from '../../components/WithdrawAd3Modal/WithdrawAd3Modal';
import { formatAd3Amount } from '../../utils/format.util';

const { Title } = Typography;

export interface Ad3TransactionsProps { }

function Ad3Transactions({ }: Ad3TransactionsProps) {
    const { address } = useAccount();
    const { chain } = useNetwork();
    const [transactions, setTransactions] = useState<Ad3Tx[]>();
    const [withdrawTxId, setWithdrawTxId] = useState<string>();

    const fetchTx = async (address: string, chainId: number) => {
        const txs = await getAd3Transactions(address, chainId);
        setTransactions(txs);
    }

    useEffect(() => {
        if (address) {
            fetchTx(address, chain!.id);
        }
    }, [address]);

    const columns: ColumnsType<Ad3Tx> = [
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
                // todo: can claim or not
                return <>
                    {formatAd3Amount(`${record.diff}`)}

                    {record.type === 'withdraw' && <>
                        <Button type='primary' onClick={() => {
                            setWithdrawTxId(record.txId);
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
