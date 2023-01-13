import React, { useEffect, useState } from 'react';
import { useWeb3Modal } from "@web3modal/react";
import { useAccount, useConnect, useEnsName, useNetwork, useSignMessage } from 'wagmi';
import { Button, notification } from 'antd';
import { bindAccount, getInfluence } from '../../services/mining.service';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PARAMI_AIRDROP } from '../../models/parami';
import { useDisconnect } from 'wagmi'

const generateSignedMessage = (twitter_oauth_verifier: string): string => {
    return `Parami Influence Mining:

My twitter oauth verifier: ${twitter_oauth_verifier}
`;
};

function Auth() {
    const { open } = useWeb3Modal();
    const [searchParams, setSearchParams] = useSearchParams();
    const { address, isConnected } = useAccount();
    const { chain } = useNetwork();
    const { data: ensName } = useEnsName({ address });
    const navigate = useNavigate();
    const { data: userSignature, isError, isLoading, isSuccess, signMessage } = useSignMessage();
    // const { disconnect } = useDisconnect();
    const [oauthToken, setOauthToken] = useState<string>();
    const [oauthVerifier, setOauthVerifier] = useState<string>();

    const storageHandler = (event: any) => {
        if (event.key === 'oauth_token') {
            setOauthToken(event.newValue);
        } else if (event.key === 'oauth_verifier') {
            setOauthVerifier(event.newValue);
        }
    }

    const handleConnectTwitter = async () => {
        const resp = await fetch(`${PARAMI_AIRDROP}/request_oauth_token?callbackUrl=${window.origin}`);
        const { oauthUrl } = await resp.json();
        window.open(oauthUrl);
        window.addEventListener('storage', storageHandler);
    }

    useEffect(() => {
        if (oauthToken && oauthVerifier) {
            signMessage({message: generateSignedMessage(oauthVerifier)});
            window.removeEventListener('storage', storageHandler);
            window.localStorage.removeItem('oauth_token');
            window.localStorage.removeItem('oauth_verifier');
        }
    }, [oauthToken, oauthVerifier])

    useEffect(() => {
        if (userSignature) {
            bindAccount(address!, chain!.id, oauthToken!, oauthVerifier!, userSignature, generateSignedMessage(oauthVerifier!), searchParams.get('referer') ?? '').then((res) => {
                if (res.success) {
                    notification.success({
                        message: 'Bind Success!'
                    })
                    navigate('/profile');
                    return;
                }

                notification.warning({
                    message: res.message
                })
            })
        }
    }, [userSignature]);

    useEffect(() => {
        if (address && chain?.id) {
            getInfluence(address!, chain.id).then(influence => {
                if (influence?.updatedTime) {
                    navigate('/profile');
                }
            })
        }
    }, [address, chain]);

    return <>
        <div>
            <div>
                <Button type='primary' disabled={isConnected} onClick={() => {
                    open({ route: 'ConnectWallet' });
                }}>
                    {isConnected && <>Connected to {ensName ?? address}</>}
                    {!isConnected && <>Connect Wallet</>}
                </Button>
                {/* <Button type='primary' onClick={() => {
                    disconnect();
                }}>Disconnect</Button> */}
            </div>
            <br></br>
            <div>
                <Button type='primary' disabled={!isConnected} onClick={handleConnectTwitter}>
                    Connect Twitter
                </Button>
            </div>
        </div>
    </>;
};

export default Auth;
