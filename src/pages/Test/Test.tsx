import { Button, notification } from 'antd';
import React, { useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import BillboardNftImage from '../../components/BillboardNftImage/BillboardNftImage';
import MintBillboard from '../../components/MintBillboard/MintBillboard';
import { PARAMI_AIRDROP } from '../../models/parami';

export interface TestProps { }

function Test({ }: TestProps) {
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();
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

    // useEffect(() => {
    //     if (userSignature) {
    //         notification.success({ message: userSignature })
    //     }
    // }, [userSignature])

    return <>
        <div style={{ width: '400px', height: '400px' }}>
            <BillboardNftImage imageUrl='https://pbs.twimg.com/profile_images/1611305582367215616/4W9XpGpU.jpg'></BillboardNftImage>
        </div>

        {/* <Button onClick={() => {
            disconnect()
        }}>
            Disconnect
        </Button> */}
        <br></br>

        {/* <MintBillboard></MintBillboard> */}
    </>;
};

export default Test;
