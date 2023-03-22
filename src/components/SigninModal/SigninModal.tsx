import { Modal } from 'antd';
import React from 'react';
import { isMobile } from 'react-device-detect';
import { getTwitterOauthUrl } from '../../services/mining.service';
import './SigninModal.scss';

export interface SigninModalProps { }

function SigninModal({ }: SigninModalProps) {

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
    return <>
        <Modal
            className='signin-modal'
            open
            centered
            closable={false}
            maskClosable={false}
            footer={null}
            width={472}
        >
            <div className='header'>
                Login
            </div>
            <div className='modal-footer'>
                <div className='action-btn-primary active' onClick={() => {
                    handleConnectTwitter();
                }}>
                    <div>
                        <span className='icon'>
                            <i className="fa-brands fa-twitter"></i>
                        </span>
                        Connect Twitter
                    </div>
                </div>
            </div>
        </Modal>
    </>;
};

export default SigninModal;
