
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
import { isMobile } from 'react-device-detect';

function Auth() {
    const navigate = useNavigate();
    const { imAccount } = useImAccount();
    const [params] = useSearchParams();

    useEffect(() => {
        const code = params.get('code');

        if (code) {
            createAccountOrLogin(code).then(res => {
                if (res.success) {
                    notification.success({
                        message: 'Login Successful!'
                    })
                    navigate('/miner');
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
            navigate('/miner');
        }
    }, [imAccount]);

    const handleConnectTwitter = async () => {
        const oauthUrl = await getTwitterOauthUrl();

        if (oauthUrl) {
            if (isMobile) {
                window.location.href = `${oauthUrl}`;
                // window.open(oauthUrl);
                return;
            }

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
