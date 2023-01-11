import React, { useEffect, useState } from 'react';
import { useWeb3Modal } from "@web3modal/react";
import { useAccount, useConnect, useEnsName, useNetwork, useSignMessage } from 'wagmi';
import { Button, notification } from 'antd';
import { bindAccount, getInfluence } from '../../services/mining.service';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PARAMI_AIRDROP } from '../../models/parami';

const generateMessage = (code: string) => {
    return `Parami Influence Mining:\n\nMy twitter oauth ticket: ${code}`;
}

const generateSignedMessage = (twitter_oauth_ticket: string): string => {
    return `Parami Influence Mining:

My twitter oauth ticket: ${twitter_oauth_ticket}
`;
};

function Auth() {
    const { open } = useWeb3Modal();
    const [searchParams, setSearchParams] = useSearchParams();
    const { address, isConnected } = useAccount();
    const { chain } = useNetwork();
    const { data: ensName } = useEnsName({ address });
    const navigate = useNavigate();
    // const [msg, setMsg] = useState<string>();
    const { data: userSignature, isError, isLoading, isSuccess, signMessage } = useSignMessage();
    const [code, setCode] = useState<string>();

    const handleConnectTwitter = async () => {
        // window.location.href = `http://localhost:8080/api/twitter/login?state=connectTwitter&callback=${window.origin}/twitter/oauth`
        // window.open(`${PARAMI_AIRDROP}/influencemining/api/twitter/login?state=connectTwitter`);
        // const resp = await fetch(`${'http://localhost:8080'}/influencemining/api/twitter/login?state=connect`);
        // const { oauthUrl } = await resp.json();
        window.open(`${PARAMI_AIRDROP}/influencemining/api/twitter/login?state=connect`);
        // window.location.href = `${'http://localhost:8080'}/influencemining/api/twitter/login?state=connectTwitter`;

        const storageHandler = (event: any) => {
            console.log('Got localStorage event', event);
            if (event.key === 'twitterOauth') {
                console.log('twitterOauth!');
                const code = event.newValue;
                setCode(code);
                signMessage({ message: generateSignedMessage(code) });

                window.removeEventListener('storage', storageHandler);
                window.localStorage.removeItem('twitterOauth');
            }
            // const { code, state } = event.data ?? {};
            // console.log('message handler: ', event.origin, code, state);
            // if (event.origin === window.origin && code && state) { // todo: check state
            //     // sign message
            //     // const msg = `Parami Influence Mining:\n\nMy twitter oauth ticket: ${code}`;
            //     // setMsg(msg);
            //     setCode(code);
            //     signMessage({ message: generateMessage(code) });

            //     window.removeEventListener('message', storageHandler);
            // }
        }

        window.addEventListener('storage', storageHandler);
    }

    useEffect(() => {
        if (userSignature) {
            bindAccount(address!, chain!.id, code!, userSignature, generateSignedMessage(code!), searchParams.get('referer') ?? '').then((res) => {
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
                    open();
                }}>
                    {isConnected && <>Connected to {ensName ?? address}</>}
                    {!isConnected && <>Connect Wallet</>}
                </Button>
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
