import { Button, Modal, Row, Col } from 'antd';
import React, { useState } from 'react';
import './WithdrawAd3Modal.scss';

export interface WithdrawAd3ModalProps {
    onCancel: () => void;
}

function WithdrawAd3Modal({ onCancel }: WithdrawAd3ModalProps) {
    const [amount, setAmount] = useState<number>();
    const [loading, setLoading] = useState<boolean>(false);

    const handleWithdraw = () => {
        // generate signature
        // claim ad3 on eth
    }

    return <>
        <Modal
            open
            title="Withdraw"
            onCancel={() => { onCancel() }}
            footer={[
                <Button key="submit" type="primary" loading={false} onClick={() => {}}>
                    Submit
                </Button>
            ]}
        >
            <Row className='input-row'>
                <Col span={18}>
                    <div className='ad3-input'>
                        <input value={amount} placeholder='0' onChange={e => {
                            setAmount(Number(e.target.value))
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
        </Modal>
    </>;
};

export default WithdrawAd3Modal;
