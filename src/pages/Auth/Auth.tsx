
import React, { useEffect, useState } from 'react';
import { useWeb3Modal } from "@web3modal/react";
import { useAccount, useEnsName, useNetwork, useSigner } from 'wagmi';
import { notification } from 'antd';
import { bindAccount, getIMAccountOfWallet } from '../../services/mining.service';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PARAMI_AIRDROP } from '../../models/parami';
import './Auth.scss';

const ONE_HOUR = 60 * 60 * 1000;
const ONE_WEEK = 7 * 24 * ONE_HOUR;

const getExpirationTime = () => {
    return Date.now() + ONE_WEEK;
}

const generateSignedMessage = (address: string, expire: number): string => {
    return `${address},${expire}`;
};

function Auth() {
    const { open } = useWeb3Modal();
    const [searchParams, setSearchParams] = useSearchParams();
    const { address, isConnected } = useAccount();
    const { chain } = useNetwork();
    const { data: signer } = useSigner();
    const { data: ensName } = useEnsName({ address });
    const navigate = useNavigate();
    const [oauthToken, setOauthToken] = useState<string>();
    const [oauthVerifier, setOauthVerifier] = useState<string>();
    const [userSignature, setUserSignature] = useState<string>();

    useEffect(() => {
        if (isConnected) {
            const sessionExpirationTime = window.localStorage.getItem('sessionExpirationTime');
            const sig = window.localStorage.getItem('sessionSig');
            if (sessionExpirationTime && sig && Number(sessionExpirationTime) > Date.now()) {
                setUserSignature(sig);
            }
        }
    }, [isConnected])

    useEffect(() => {
        if (userSignature) {
            getIMAccountOfWallet(address!, chain!.id).then(imAccount => {
                if (imAccount?.updatedTime) {
                    navigate('/profile');
                }
            })
        }
    }, [userSignature])

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

    const signMessage = async () => {
        const expire = getExpirationTime();
        const sig = await signer?.signMessage(generateSignedMessage(address!, expire));
        // set localStorage
        window.localStorage.setItem('sessionExpirationTime', `${expire}`);
        window.localStorage.setItem('sessionSig', `${sig}`);

        setUserSignature(sig);
    }

    useEffect(() => {
        if (oauthToken && oauthVerifier) {
            window.removeEventListener('storage', storageHandler);
            window.localStorage.removeItem('oauth_token');
            window.localStorage.removeItem('oauth_verifier');

            bindAccount(address!, chain!.id, oauthToken, oauthVerifier, window.localStorage.getItem('referer') ?? '').then(res => {
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
    }, [oauthToken, oauthVerifier])

    return <>
        <div className='auth-container'>
            <div className='logo-container'>
                <img className='logo' src='/assets/images/logo-core-white.svg'></img>
            </div>

            <div className='btn-container'>
                {!isConnected && <>
                    <div className='connect-btn active' onClick={async () => {
                        open();
                    }}>
                        Connect Wallet
                    </div>

                    <div className='connect-btn disabled'>Connect Twitter</div>
                </>}

                {isConnected && <>
                    <div className='connect-btn disabled'>
                        Wallet Connected{ensName ? ` as ${ensName}` : ''}
                    </div>

                    {!userSignature && <>
                        <div className='connect-btn active' onClick={() => {
                            signMessage();
                        }}>
                            Sign Message
                        </div>

                        <div className='connect-btn disabled'>Connect Twitter</div>
                    </>}

                    {userSignature && <>
                        <div className='connect-btn active' onClick={handleConnectTwitter}>
                            Connect Twitter
                        </div>
                    </>}
                </>}
            </div>
        </div>
    </>;
};

export default Auth;
