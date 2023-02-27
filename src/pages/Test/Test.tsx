import { Button, notification } from 'antd';
import React, { useEffect } from 'react';
import { redirect, useNavigate } from 'react-router-dom';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import BillboardNftImage from '../../components/BillboardNftImage/BillboardNftImage';
import MintBillboard from '../../components/MintBillboard/MintBillboard';
import { PARAMI_AIRDROP } from '../../models/parami';
// import { getQueryFields } from '../../services/mining.service';

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

    const navigate = useNavigate();

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

    // useEffect(() => {
    //     getQueryFields();
    // }, [])

    return <>
        {/* <div style={{ width: '400px', height: '400px' }}>
            <BillboardNftImage imageUrl='https://pbs.twimg.com/profile_images/1611305582367215616/4W9XpGpU.jpg'></BillboardNftImage>
        </div> */}

        {/* <Button onClick={() => {
            disconnect()
        }}>
            Disconnect
        </Button> */}
        <div style={{
            marginTop: '200px',
            background: '#000'
        }}>
            <div className='action-btn active' onClick={() => {
                // navigate('https://www.twitter.com')
                // window.location.href = 'https://www.twitter.com/home'
                // redirect('/vault');
                navigate('/vault');
            }}>Try Twitter</div>
            <br></br>
        </div>


        {/* <MintBillboard></MintBillboard> */}
    </>;
};

export default Test;
