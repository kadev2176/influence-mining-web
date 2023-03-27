import { Modal, Tooltip } from 'antd';
import React from 'react';
import { useImAccount } from '../../hooks/useImAccount';
import { useMintBillboard } from '../../hooks/useMintBillboard';
import BillboardNftImage from '../BillboardNftImage/BillboardNftImage';
import Confetti from '../Confetti/Confetti';
import './MintNFTModal.scss';

export interface MintNFTModalProps {
    onCancel: () => void
}

const nftOptions = [
    {
        level: 0,
        name: 'Common Billboard',
    },
    {
        level: 1,
        name: 'Uncommon Billboard',
    },
    {
        level: 2,
        name: 'Rare Billboard',
    },
    {
        level: 3,
        name: 'Epic Billboard',
    },
    {
        level: 4,
        name: 'Legendary Billboard',
    }
];

function MintNFTModal({ onCancel }: MintNFTModalProps) {
    const { imAccount } = useImAccount();
    const [selectedNft, setSelectedNft] = React.useState<{ level: number; name: string }>();
    const { mint, isSuccess: mintSuccess, isLoading: mintLoading, error: mintError } = useMintBillboard(selectedNft?.level, imAccount?.twitterProfileImageUri ?? '');

    return <>
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
                        <Tooltip title="prompt text">
                            <span className='icon'>
                                <i className="fa-regular fa-circle-question"></i>
                            </span>
                        </Tooltip>
                    </div>
                    <div className='sub-title'>
                        This NFT supports hyperlinks, and you can define the link content yourself
                    </div>
                </div>
                <div className='content'>
                    {imAccount && !mintSuccess && <>
                        <div className='nfts'>
                            {nftOptions.map((nftOption, index) => {
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
                                            <span className='icon'>
                                                <i className="fa-brands fa-ethereum"></i>
                                            </span>
                                            0.3
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
                        if (mintSuccess) {
                            onCancel();
                            return;
                        }
                        if (selectedNft && mint) {
                            mint()
                        }
                    }}>{mintSuccess ? 'Done' : 'Mint'}</div>
                </div>
            </div>
        </Modal>
    </>;
};

export default MintNFTModal;
