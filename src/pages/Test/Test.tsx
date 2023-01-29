import { Button, notification } from 'antd';
import React, { useEffect } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import MintBillboard from '../../components/MintBillboard/MintBillboard';
import { PARAMI_AIRDROP } from '../../models/parami';

export interface TestProps { }

function Test({ }: TestProps) {
    const { address, isConnected } = useAccount();
    const { data: userSignature, isError, isLoading, isSuccess, signMessage } = useSignMessage();

    const handleConnectTwitter = async () => {
        const resp = await fetch(`${PARAMI_AIRDROP}/request_oauth_token?callbackUrl=${window.origin}`);
        const { oauthUrl } = await resp.json();
        // window.open(oauthUrl);
        window.location.assign(oauthUrl);
        // window.addEventListener('storage', storageHandler);
    }

    // useEffect(() => {
    //     setTimeout(() => {
    //         notification.info({
    //             message: 'Test sign message in metamask'
    //         })
    //         signMessage({ message: 'connect twitter' });
    //     }, 1000)
    // }, [])

    useEffect(() => {
        if (userSignature) {
            notification.success({ message: userSignature })
        }
    }, [userSignature])

    return <>
        <Button onClick={handleConnectTwitter}>
            Test Connect Twitter
        </Button>
        <br></br>

        <MintBillboard influence={{twitterProfileImageUri: ''} as any}></MintBillboard>
    </>;
};

export default Test;
