import { ConfigProvider, Table, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { getInfluenceTransactions, InfluenceTransaction } from '../../services/mining.service';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import './InfluenceTransactions.scss';

const { Title } = Typography;

export interface InfluenceTransactionsProps { }

function InfluenceTransactions({ }: InfluenceTransactionsProps) {
    const { address } = useAccount();
    const { chain } = useNetwork();
    const [transactions, setTransactions] = useState<InfluenceTransaction[]>();

    useEffect(() => {
        if (address) {
            getInfluenceTransactions(address, chain!.id).then(res => {
                setTransactions(res);
            })
        }
    }, [address])

    const columns: ColumnsType<InfluenceTransaction> = [
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
        <div className='influence-txns-container'>
            <Title level={3}>Social Influence</Title>
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

export default InfluenceTransactions;
