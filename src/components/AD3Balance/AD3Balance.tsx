import { Col, Row, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { Balance, getAd3Balance } from '../../services/mining.service';
import './AD3Balance.scss';

const { Title } = Typography;

export interface AD3BalanceProps { }

function AD3Balance({ }: AD3BalanceProps) {
    const { address } = useAccount();
    const [balance, setBalance] = useState<Balance>();
    useEffect(() => {
        if (address) {
            getAd3Balance(address).then(res => {
                setBalance(res);
            });
        }
    }, [address])
    return <>
        <div className='balance-container'>
            <Title level={3}>Balance</Title>
            <div className='balance-card'>
                {balance && <>
                    <Row style={{ width: '100%' }}>
                        <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                            <div className='total-balance'>
                                <div className='icon'>
                                    <img src='/logo-round-core.svg'></img>
                                    Total
                                </div>
                                <div className='value'>
                                    <div className='balance'>
                                        {balance.total}
                                    </div>
                                    <div className='unit'>$AD3</div>
                                </div>
                            </div>
                        </Col>
                        <Col xl={12} lg={12} md={24} sm={24} xs={24} className='sub-balance'>
                            <Row justify="space-between" className='sub-balance-row'>
                                <Col className='label'>
                                    <i className="fa-solid fa-coins"></i>
                                    <span className='text'>Withdrawable Balance</span>
                                </Col>
                                <Col className='value'>
                                    <div className='balance'>{balance.withdrawable}</div>
                                    <div className='unit'>$AD3</div>
                                </Col>
                            </Row>
                            <Row justify="space-between" className='sub-balance-row'>
                                <Col className='label'>
                                    <i className="fa-solid fa-lock"></i>
                                    <span className='text'>Locked Balance</span>
                                </Col>
                                <Col className='value'>
                                    <div className='balance'>{balance.locked}</div>
                                    <div className='unit'>$AD3</div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </>}

            </div>
        </div>
    </>;
};

export default AD3Balance;
