import { Modal, notification, Tooltip } from 'antd';
import React from 'react';
import { isMobile } from 'react-device-detect';
import { useImAccount } from '../../hooks/useImAccount';
import { useMintBillboard } from '../../hooks/useMintBillboard';
import { HNFT_CONFIG } from '../../models/parami';
import BillboardNftImage from '../BillboardNftImage/BillboardNftImage';
import Confetti from '../Confetti/Confetti';
import MobileDrawer from '../MobileDrawer/MobileDrawer';
import './MintNFTModal.scss';

export interface MintNFTModalProps {
    onCancel: () => void
}

function MintNFTModal({ onCancel }: MintNFTModalProps) {
    const { imAccount } = useImAccount();
    const [selectedNft, setSelectedNft] = React.useState<{ level: number; name: string }>();
    const { mint, isSuccess: mintSuccess, isLoading: mintLoading, error: mintError } = useMintBillboard(selectedNft?.level, imAccount?.twitterProfileImageUri ?? '');

    return <>
        {!isMobile && <>
            <Modal
                className='mint-nft-modal'
                open
                title=""
                onCancel={() => {
                    onCancel()
                }}
                footer={null}
                width={956}
            >
                <div className='mint-nft-container'>
                    <div className='header'>
                        <div className='title-row'>
                            <div className='title'>Mint My HNFT</div>
                            {/* <Tooltip title="NFT is the unique identifier of your DID. After casting successfully, you can directly withdraw coins to your NFT address">
                                <span className='icon'>
                                    <i className="fa-regular fa-circle-question"></i>
                                </span>
                            </Tooltip> */}
                        </div>
                        <div className='sub-title'>
                            This NFT supports hyperlinks, and you can define the link content yourself
                        </div>
                    </div>
                    <div className='content'>
                        {imAccount && !mintSuccess && <>
                            <div className='nfts'>
                                {HNFT_CONFIG.map((nftOption, index) => {
                                    return <>
                                        <div
                                            className={`nft`}
                                            key={index}
                                            onClick={() => {
                                                setSelectedNft(nftOption)
                                            }}
                                        >
                                            <div className='nft-image-container'>
                                                <BillboardNftImage
                                                    imageUrl={imAccount?.twitterProfileImageUri}
                                                    level={nftOption.level}
                                                    active
                                                    selected={nftOption.level === selectedNft?.level}
                                                ></BillboardNftImage>
                                            </div>
                                            <div className='price'>
                                                {nftOption.price !== '0' && <>
                                                    <span className='icon'>
                                                        <i className="fa-brands fa-ethereum"></i>
                                                    </span>
                                                    {nftOption.price}
                                                </>}
                                                {nftOption.price === '0' && <>
                                                    free
                                                </>}
                                            </div>
                                            <div className='name'>{nftOption.name}</div>
                                        </div>
                                    </>
                                })}
                            </div>
                        </>}

                        {imAccount && mintSuccess && selectedNft && <>
                            <div className='nft-success'>
                                <div className='nft-image-container'>
                                    <BillboardNftImage imageUrl={imAccount?.twitterProfileImageUri} level={selectedNft.level}></BillboardNftImage>
                                </div>

                                <div className='description'>
                                    Congratulations, your HNFT has been successfully mint
                                </div>

                                <div className='confetti'>
                                    <Confetti></Confetti>
                                </div>
                            </div>
                        </>}
                    </div>
                    <div className='footer'>
                        <div className='divider'></div>
                        <div className='action-btn-primary active' onClick={() => {
                            notification.info({
                                message: 'Coming soon',
                            })
                            // if (mintSuccess) {
                            //     onCancel();
                            //     return;
                            // }
                            // if (selectedNft && mint) {
                            //     mint()
                            // }
                        }}>{mintSuccess ? 'Done' : 'Mint'}</div>
                    </div>
                </div>
            </Modal>
        </>}

        {isMobile && <>
            <MobileDrawer closable onClose={onCancel}>
                <div className='mint-nft-drawer'>
                    <div className='title'>Mint My HNFT</div>
                    <div className='sub-title'>
                        This NFT supports hyperlinks, and you can define the link content yourself
                    </div>
                    {imAccount && <>
                        <div className='nfts'>
                            {HNFT_CONFIG.map((nftOption, index) => {
                                return <>
                                    <div
                                        className={`nft`}
                                        key={index}
                                        onClick={() => {
                                            setSelectedNft(nftOption)
                                        }}
                                    >
                                        <div className='nft-image-container'>
                                            <BillboardNftImage
                                                imageUrl={imAccount?.twitterProfileImageUri}
                                                level={nftOption.level}
                                                active
                                                selected={nftOption.level === selectedNft?.level}
                                            ></BillboardNftImage>
                                        </div>
                                        <div className='price'>
                                            {nftOption.price !== '0' && <>
                                                <span className='icon'>
                                                    <i className="fa-brands fa-ethereum"></i>
                                                </span>
                                                {nftOption.price}
                                            </>}
                                            {nftOption.price === '0' && <>
                                                free
                                            </>}
                                        </div>
                                        <div className='name'>{nftOption.name}</div>
                                    </div>
                                </>
                            })}
                        </div>
                    </>}

                    <div className='btn-container'>
                        <div className='action-btn-primary active' onClick={() => {
                            notification.info({
                                message: 'Coming soon',
                            })
                        }}>
                            Mint
                        </div>
                    </div>
                </div>
            </MobileDrawer>
        </>}
    </>;
};

export default MintNFTModal;
