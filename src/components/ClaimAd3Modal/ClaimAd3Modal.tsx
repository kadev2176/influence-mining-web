import { Modal, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { useWithdrawAD3 } from '../../hooks/useWithdrawAD3';
import { generateWithdrawSignature, getAd3Balance, WithdrawAd3Signature } from '../../services/mining.service';
import { amountToFloatString, inputFloatStringToAmount } from '../../utils/format.util';
import './ClaimAd3Modal.scss';
import { isMobile } from 'react-device-detect';
import MobileDrawer from '../MobileDrawer/MobileDrawer';
import LoadingBar from '../LoadingBar/LoadingBar';

export interface ClaimAd3ModalProps {
    onCancel: () => void;
    onSuccess: () => void;
}

function ClaimAd3Modal({ onCancel, onSuccess }: ClaimAd3ModalProps) {
    const { address } = useAccount();
    const { chain } = useNetwork();
    const [balance, setBalance] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const [withdrawSig, setWithdrawSig] = useState<WithdrawAd3Signature>();
    const { withdraw, isError, isLoading, isSuccess } = useWithdrawAD3(withdrawSig?.amount, withdrawSig?.nounce, withdrawSig?.sig);
    const withdrawReady = !!withdraw;

    useEffect(() => {
        getAd3Balance().then(balance => {
            const balanceFloat = amountToFloatString(balance?.balance ?? '0');
            setBalance(Number(balanceFloat).toFixed(4));
        })
    }, [])

    const onClaim = async () => {
        setLoading(true);
        try {
            const ad3balance = await getAd3Balance();
            const maxAmount = ad3balance?.balance ?? '0';
            const inputAmount = inputFloatStringToAmount(balance);
            const amount = BigInt(inputAmount) > BigInt(maxAmount) ? maxAmount : inputAmount;
            const sig = await generateWithdrawSignature(amount);
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
        if (withdrawSig && withdrawReady) {
            withdraw?.();
        }
    }, [withdrawSig, withdrawReady])

    useEffect(() => {
        if (isSuccess) {
            setLoading(false);
            onSuccess();
        }
    }, [isSuccess])

    const content = <>
        <div className='header'>Claim My AD3</div>
        <div className='content'>
            {!loading && <>
                <div className='value'>
                    <input type='number' value={balance} onChange={(e) => {
                        setBalance(e.target.value);
                    }}></input>
                </div>
                <div className='unit'>$AD3</div>
            </>}

            {loading && <>
                <LoadingBar></LoadingBar>
            </>}
        </div>
        <div className='footer'>
            {!loading && <>
                <div className={`action-btn-primary ${Number(balance) > 0 ? 'active' : 'disabled'}`} onClick={() => {
                    onClaim()
                }}>Claim</div>
            </>}

            {loading && <>
                <div className={`action-btn-primary disabled`}>Claim</div>
            </>}
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
