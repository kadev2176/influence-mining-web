import { Button, Col, Row, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useNetwork } from 'wagmi';
import { Balance, getAd3Balance } from '../../services/mining.service';
import { formatAd3Amount } from '../../utils/format.util';
import WithdrawAd3Modal from '../WithdrawAd3Modal/WithdrawAd3Modal';
import './AD3Balance.scss';

const { Title } = Typography;

export interface AD3BalanceProps { }

function AD3Balance({ }: AD3BalanceProps) {
    const navigate = useNavigate();
    const { address } = useAccount();
    const { chain } = useNetwork();
    const [balance, setBalance] = useState<Balance>();
    const [withdrawModal, setWithdrawModal] = useState<boolean>(false);

    const fetchBalance = async (address: string, chainId: number) => {
        const balance = await getAd3Balance(address, chainId);
        setBalance(balance);
    }

    useEffect(() => {
        if (address && chain?.id) {
            fetchBalance(address, chain.id);
        }
    }, [address, chain]);

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
                                <div className='value' onClick={() => {
                                    navigate('/ad3Tx')
                                }}>
                                    <div className='balance'>
                                        {formatAd3Amount(balance.total)}
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
                                    <div className='balance'>{formatAd3Amount(balance.withdrawable)}</div>
                                    <div className='unit'>$AD3</div>
                                </Col>
                                <Col className='action'>
                                    <div>
                                        <Button type='primary' onClick={() => {
                                            setWithdrawModal(true);
                                        }}>Withdraw</Button>
                                    </div>
                                </Col>
                            </Row>
                            <Row justify="space-between" className='sub-balance-row'>
                                <Col className='label'>
                                    <i className="fa-solid fa-lock"></i>
                                    <span className='text'>Locked Balance</span>
                                </Col>
                                <Col className='value'>
                                    <div className='balance'>{formatAd3Amount(balance.locked)}</div>
                                    <div className='unit'>$AD3</div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </>}
            </div>
        </div>

        {withdrawModal && <>
            <WithdrawAd3Modal
                onCancel={() => {
                    setWithdrawModal(false);
                }}
                onSuccess={() => {
                    setWithdrawModal(false);
                    fetchBalance(address!, chain!.id);
                }}
                withdrawableAmount={balance?.withdrawable}
            ></WithdrawAd3Modal>
        </>}
    </>;
};

export default AD3Balance;
