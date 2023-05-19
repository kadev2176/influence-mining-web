import React, { useEffect } from 'react';
import LoadingBar from '../../components/LoadingBar/LoadingBar';
import './ClaimAd.scss';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { notification } from 'antd';
import { claimToken } from '../../services/claim.service';

export interface ClaimAdProps { }

function ClaimAd({ }: ClaimAdProps) {
    const [params] = useSearchParams();
    const nagivate = useNavigate();
    useEffect(() => {
        if (params) {
            const bidId = params.get('bidId');
            const tagsParams = params.get('tags');
            if (bidId) {
                const tags = tagsParams ? tagsParams.split(',') : [];
                claimToken(bidId, tags).then(res => {
                    if (res === null) {
                        nagivate('/miner');
                        return;
                    }

                    if (res.success) {
                        notification.success({
                            message: 'Claim Successful!',
                            duration: 1
                        })
                        setTimeout(() => {
                            window.close();
                        }, 1000);
                        return;
                    }

                    notification.warning({
                        message: res.message ?? 'Network Error'
                    });
                })
            } else {
                notification.warning({
                    message: 'Could not find bidId'
                })
            }
        }
    }, [params])

    return <>
        <div className='claim-ad-container'>
            <LoadingBar></LoadingBar>
        </div>
    </>;
};

export default ClaimAd;
