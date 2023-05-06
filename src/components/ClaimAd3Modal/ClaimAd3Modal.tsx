import { Modal, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { useWithdrawAD3 } from '../../hooks/useWithdrawAD3';
import { generateWithdrawSignature, getAd3Balance, WithdrawAd3Signature } from '../../services/mining.service';
import { amountToFloatString, inputFloatStringToAmount } from '../../utils/format.util';
import './ClaimAd3Modal.scss';
import { isMobile } from 'react-device-detect';
import MobileDrawer from '../MobileDrawer/MobileDrawer';

export interface ClaimAd3ModalProps {
    onCancel: () => void
}

function ClaimAd3Modal({ onCancel }: ClaimAd3ModalProps) {
    const { address } = useAccount();
    const { chain } = useNetwork();
    const [balance, setBalance] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const [withdrawSig, setWithdrawSig] = useState<WithdrawAd3Signature>();
    const { withdraw, isError, isLoading, isSuccess } = useWithdrawAD3(withdrawSig?.amount, withdrawSig?.nounce, withdrawSig?.sig);

    useEffect(() => {
        getAd3Balance().then(balance => {
            setBalance(amountToFloatString(balance?.balance ?? '0'))
        })
    }, [])

    const onClaim = async () => {
        setLoading(true);
        try {
            const sig = await generateWithdrawSignature(inputFloatStringToAmount(balance));
            setWithdrawSig(sig);
        } catch (e) {
            setLoading(false);
        }
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

    // useEffect(() => {
    //     if (isSuccess) {
    //         setLoading(false);
    //         onSuccess();
    //     }
    // }, [isSuccess])

    const content = <>
        <div className='header'>Claim My AD3</div>
        <div className='content'>
            <div className='value'>{balance ? Number(balance).toFixed(4) : ''}</div>
            <div className='unit'>$AD3</div>
        </div>
        <div className='footer'>
            <div className='action-btn-primary active' onClick={() => {
                notification.info({
                    message: 'Coming soon'
                })
                // onClaim()
            }}>Claim</div>
        </div>
    </>

    return <>
        {!isMobile && <>
            <Modal
                className='claim-ad3-modal'
                open
                title=""
                onCancel={() => {
                    onCancel()
                }}
                footer={null}
                width={956}
            >
                {content}
            </Modal>
        </>}

        {isMobile && <>
            <MobileDrawer closable onClose={onCancel}>
                <div className='claim-ad3-drawer'>
                    {content}
                </div>
            </MobileDrawer>
        </>}
    </>;
};

export default ClaimAd3Modal;
