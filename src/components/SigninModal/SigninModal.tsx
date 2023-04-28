import { Drawer, Modal } from 'antd';
import React from 'react';
import { isMobile } from 'react-device-detect';
import { getTwitterOauthUrl } from '../../services/mining.service';
import MobileDrawer from '../MobileDrawer/MobileDrawer';
import './SigninModal.scss';
import { useSearchParams } from 'react-router-dom';

export interface SigninModalProps { }

function SigninModal({ }: SigninModalProps) {
    const [params] = useSearchParams();

    const handleConnectTwitter = async () => {
        const oauthUrl = await getTwitterOauthUrl(params.get('tag'));

        if (oauthUrl) {
            if (isMobile) {
                window.location.href = `${oauthUrl}`;
                return;
            }

            // direct oauth
            window.location.href = oauthUrl;
        }
    }
    return <>
        {!isMobile && <>
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
        </>}

        {isMobile && <>
            <MobileDrawer closable={false}>
                <div className='drawer-title'>
                    Login
                </div>
                <div className='drawer-btn-container'>
                    <div className='action-btn-primary active' onClick={() => {
                        handleConnectTwitter();
                    }}>
                        <span className='icon'>
                            <i className="fa-brands fa-twitter"></i>
                        </span>
                        Connect Twitter
                    </div>
                </div>
            </MobileDrawer>
        </>}
    </>;
};

export default SigninModal;
