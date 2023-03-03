
import React, { useEffect, useState } from 'react';
import { useWeb3Modal } from "@web3modal/react";
import { useAccount, useEnsName, useNetwork, useSigner } from 'wagmi';
import { notification } from 'antd';
import { bindAccount, createAccountOrLogin, getTwitterOauthUrl } from '../../services/mining.service';
import { redirect, useNavigate, useSearchParams } from 'react-router-dom';
import './Auth.scss';
import { generateSignedMessage, getSigExpirationTime } from '../../utils/api.util';
import { useImAccount } from '../../hooks/useImAccount';
import { parseUrlParams } from '../../utils/window.util';

function Auth() {
    // const { open } = useWeb3Modal();
    // const [searchParams, setSearchParams] = useSearchParams();
    // const { address, isConnected } = useAccount();
    // const { chain } = useNetwork();
    // const { data: signer } = useSigner();
    // const { data: ensName } = useEnsName({ address });
    const navigate = useNavigate();
    const { imAccount } = useImAccount();
    const [params] = useSearchParams();

    useEffect(() => {
        const token = params.get('oauth_token');
        const verifier = params.get('oauth_verifier');
        if (token && verifier) {
            createAccountOrLogin(token, verifier).then(res => {
                if (res.success) {
                    notification.success({
                        message: 'Login Successful!'
                    })
                    navigate('/vault');
                    return;
                }

                if (res.status === 403) {
                    notification.warning({
                        message: 'Please Apply for Beta Access'
                    });
                    setTimeout(() => {
                        navigate('/');
                    }, 1000);
                    return;
                }

                notification.warning({
                    message: res.message
                })
            })
        }
    }, [params]);

    useEffect(() => {
        if (imAccount) {
            navigate('/vault');
        }
    }, [imAccount]);
    // const [userSignature, setUserSignature] = useState<string>();

    // useEffect(() => {
    //     if (isConnected) {
    //         const sessionExpirationTime = window.localStorage.getItem('sessionExpirationTime');
    //         const sig = window.localStorage.getItem('sessionSig');
    //         if (sessionExpirationTime && sig && Number(sessionExpirationTime) > Date.now()) {
    //             setUserSignature(sig);
    //         }
    //     }
    // }, [isConnected])

    // useEffect(() => {
    //     if (userSignature) {
    //         getMyIMAccount(address!, chain!.id).then(imAccount => {
    //             if (imAccount) {
    //                 navigate('/vault');
    //             }
    //         })
    //     }
    // }, [userSignature])

    const handleConnectTwitter = async () => {
        const oauthUrl = await getTwitterOauthUrl(window.origin);
        if (oauthUrl) {
            // direct oauth
            window.location.href = oauthUrl;
        }
    }

    // const signMessage = async () => {
    //     const expire = getSigExpirationTime();
    //     const sig = await signer?.signMessage(generateSignedMessage(address!, expire));
    //     // set localStorage
    //     window.localStorage.setItem('sessionExpirationTime', `${expire}`);
    //     window.localStorage.setItem('sessionSig', `${sig}`);

    //     setUserSignature(sig);
    // }

    // useEffect(() => {
    //     if (oauthToken && oauthVerifier) {
    //         window.removeEventListener('storage', storageHandler);
    //         window.localStorage.removeItem('oauth_token');
    //         window.localStorage.removeItem('oauth_verifier');

    //         createAccountOrLogin(oauthToken, oauthVerifier).then(res => {
    //             if (res.success) {
    //                 notification.success({
    //                     message: 'Login Success!'
    //                 })
    //                 navigate('/vault');
    //                 return;
    //             }

    //             notification.warning({
    //                 message: res.message
    //             })
    //         })

    //         // bindAccount(address!, chain!.id, oauthToken, oauthVerifier, window.localStorage.getItem('referer') ?? '').then(res => {
    //         //     if (res.success) {
    //         //         notification.success({
    //         //             message: 'Bind Success!'
    //         //         })
    //         //         navigate('/vault');
    //         //         return;
    //         //     }

    //         //     notification.warning({
    //         //         message: res.message
    //         //     })
    //         // })
    //     }
    // }, [oauthToken, oauthVerifier])

    return <>
        <div className='auth-container'>
            <div className='logo-container'>
                {/* <img className='logo' src='/assets/images/logo-core-colored.svg'></img> */}
            </div>

            <div className='btn-container'>
                <div className='connect-btn action-btn active' onClick={handleConnectTwitter}>
                    Login with Twitter
                </div>
                {/* {!isConnected && <>
                    <div className='connect-btn action-btn active' onClick={async () => {
                        open();
                    }}>
                        Connect Wallet
                    </div>

                    <div className='connect-btn action-btn disabled'>Connect Twitter</div>
                </>}

                {isConnected && <>
                    <div className='connect-btn action-btn disabled'>
                        Wallet Connected{ensName ? ` as ${ensName}` : ''}
                    </div>

                    {!userSignature && <>
                        <div className='connect-btn action-btn active' onClick={() => {
                            signMessage();
                        }}>
                            Sign Message
                        </div>

                        <div className='connect-btn action-btn disabled'>Connect Twitter</div>
                    </>}

                    {userSignature && <>
                        <div className='connect-btn action-btn active' onClick={handleConnectTwitter}>
                            Connect Twitter
                        </div>
                    </>}
                </>} */}
            </div>
        </div>
    </>;
};

export default Auth;
