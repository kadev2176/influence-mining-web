import { Button, Modal, Row, Col } from 'antd';
import React, { useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { useWithdrawAD3 } from '../../hooks/useWithdrawAD3';
import { generateWithdrawSignature, getWithdrawInfoOfTxId, WithdrawAd3Signature } from '../../services/mining.service';
import { amountToFloatString, formatAd3Amount, inputFloatStringToAmount } from '../../utils/format.util';
import './WithdrawAd3Modal.scss';

export interface WithdrawAd3ModalProps {
    onCancel: () => void;
    onSuccess: () => void;
    withdrawTxId?: string;
    withdrawableAmount?: string;
}

function WithdrawAd3Modal({ onCancel, onSuccess, withdrawTxId, withdrawableAmount }: WithdrawAd3ModalProps) {
    const { address } = useAccount();
    const { chain } = useNetwork();
    const [amount, setAmount] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const [withdrawSig, setWithdrawSig] = useState<WithdrawAd3Signature>();
    const { withdraw, isError, isLoading, isSuccess } = useWithdrawAD3(inputFloatStringToAmount(amount, 18), withdrawSig?.nonce, withdrawSig?.signature);

    useEffect(() => {
        if (withdrawTxId) {
            setLoading(true);
            getWithdrawInfoOfTxId(withdrawTxId).then(res => {
                setAmount(res.amount);
                setWithdrawSig(res.sig);
            })
        }
    }, [withdrawTxId]);

    const handleWithdraw = async () => {
        setLoading(true);
        const sig = await generateWithdrawSignature(address!, chain!.id, inputFloatStringToAmount(amount, 18));
        setWithdrawSig(sig);
    }

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
            onSuccess();
        }
    }, [isSuccess])

    return <>
        <Modal
            open
            title="Withdraw"
            onCancel={() => { onCancel() }}
            footer={[
                <Button key="submit" type="primary" loading={loading || isLoading} 
                disabled={!amount || BigInt(inputFloatStringToAmount(amount)) > BigInt(withdrawableAmount ?? '0')}
                onClick={() => {
                    handleWithdraw();
                }}>
                    Submit
                </Button>
            ]}
        >
            <Row className='input-row'>
                <Col span={18}>
                    <div className='ad3-input'>
                        <input value={amount} placeholder='0' onChange={e => {
                            setAmount(e.target.value)
                        }}></input>
                    </div>
                </Col>
                <Col span={6}>
                    <div className='icon'>
                        <img src='/logo-round-core.svg'></img>
                        AD3
                    </div>
                </Col>
            </Row>
            {!!withdrawableAmount && <>
                <Row justify="end">
                    <Col>
                        <div className='balance'>
                            <div className='value'>
                                withdrawable: {formatAd3Amount(withdrawableAmount)} AD3
                            </div>
                            <div className='btn' onClick={() => {
                                setAmount(amountToFloatString(withdrawableAmount))
                            }}>Max</div>
                        </div>
                    </Col>
                </Row>
            </>}

        </Modal>
    </>;
};

export default WithdrawAd3Modal;
