import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getTwitterUser } from '../../services/twitter.service';
import { useSignMessage, useAccount, useNetwork } from 'wagmi';
import { notification, Spin } from 'antd';
import { bindAccount } from '../../services/mining.service';

export interface TwitterOauthProps { }

function TwitterOauth({ }: TwitterOauthProps) {
    const [searchParams, setSearchParams] = useSearchParams();
    // const [msg, setMsg] = useState<string>();
    // const { address, isConnected } = useAccount();
    // const { chain } = useNetwork();
    // const navigate = useNavigate();

    // const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage();

    useEffect(() => {
        if (searchParams.get('code')) {
            const oauthData = {
                code: searchParams.get('code'),
                state: searchParams.get('state')
            }

            window.localStorage.setItem("twitterOauth", searchParams.get('code') as string);
            window.close();

            // window.opener.postMessage(oauthData, window.origin);
            // window.close();
            // const msg = `Parami Influence Mining:\n\nMy twitter oauth ticket: ${searchParams.get('code')}`;
            // setMsg(msg);
            // signMessage({ message: msg });
        }
    }, [searchParams]);

    // useEffect(() => {
    //     if (data) {
    //         // todo: get referer
    //         bindAccount(address!, chain!.id, searchParams.get('code') as string, data, msg!, '').then(() => {
    //             notification.success({
    //                 message: 'Bind Success!'
    //             })
    //             navigate('/profile');
    //         })
    //     }
    // }, [data]);

    return <>
        <div>
            <Spin />
        </div>
    </>;
};

export default TwitterOauth;
