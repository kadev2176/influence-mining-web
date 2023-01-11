import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi'
import { useNavigate } from "react-router-dom";
import { Ad3Tx, getAd3Transactions } from '../../services/mining.service';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

export interface Ad3TransactionsProps { }

function Ad3Transactions({ }: Ad3TransactionsProps) {
    const { address } = useAccount();
    const [transactions, setTransactions] = useState<Ad3Tx[]>();

    useEffect(() => {
        if (address) {
            getAd3Transactions(address).then(res => {
                console.log('got txs', res);
                setTransactions(res);
            })
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
                return <>{`${record.diff}`}</>
            }
        },
    ];

    return <>
        <div>
            <Table loading={!transactions} dataSource={transactions} columns={columns}></Table>
        </div>
    </>;
};

export default Ad3Transactions;
