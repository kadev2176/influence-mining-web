import React, { useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi'
import { useNavigate } from "react-router-dom";
import { Ad3Tx, getAd3Transactions } from '../../services/mining.service';
import { ConfigProvider, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import './Ad3Transactions.scss';

const { Title } = Typography;

export interface Ad3TransactionsProps { }

function Ad3Transactions({ }: Ad3TransactionsProps) {
    const { address } = useAccount();
    const {chain} = useNetwork();
    const [transactions, setTransactions] = useState<Ad3Tx[]>();

    useEffect(() => {
        if (address) {
            getAd3Transactions(address, chain!.id).then(res => {
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
    </>;
};

export default Ad3Transactions;
