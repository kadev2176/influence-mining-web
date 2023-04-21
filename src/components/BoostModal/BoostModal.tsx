import { Modal, notification } from 'antd';
import React from 'react';
import './BoostModal.scss';
import { useImAccount } from '../../hooks/useImAccount';

export interface BoostModalProps {
    onCancel: () => void
}

function BoostModal({ onCancel }: BoostModalProps) {
    const { imAccount } = useImAccount();
    
    return <>
        <Modal
            className='boost-modal'
            open
            title=""
            onCancel={() => {
                onCancel()
            }}
            footer={null}
            width={956}
        >
            <div className='header'>Boost My APY</div>
            <div className='content'>
                <div className='boost-section'>
                    <div className='current-stats'>
                        <div className='current-stat'>
                            <div className='stat-label'>My Boost</div>
                            <div className='stat-value'>x{imAccount?.influenceBoost}</div>
                        </div>

                        <div className='current-stat'>
                            <div className='stat-label'>APY</div>
                            {/* <div className='stat-value'>{Number(1222).toLocaleString('en-US')}%</div> */}
                            <div className='stat-value'>-</div>
                        </div>

                        <div className='current-stat'>
                            <div className='stat-label'>TVL</div>
                            {/* <div className='stat-value'>{Number(1222).toLocaleString('en-US')}</div> */}
                            <div className='stat-value'>-</div>
                        </div>
                    </div>
                    <div className='boost-btn'
                        onClick={() => {
                            notification.info({
                                message: 'Coming Soon'
                            })
                        }}
                    >Boost</div>
                </div>
                <div className='info-section'>
                    <div className='info-title'>What is boost</div>
                    <div className='boost-description'>
                        Boost is a bonus mechanism dedicated to improving the mining utility of users in the community. GPTMiner provides a mining multiple based on the number of AD3s staked in each user's liquidity pool.
                    </div>
                </div>
            </div>
        </Modal>
    </>;
};

export default BoostModal;
