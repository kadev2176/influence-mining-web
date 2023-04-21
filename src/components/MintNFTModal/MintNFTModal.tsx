import { Modal, notification, Tooltip } from 'antd';
import React, { useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { useImAccount } from '../../hooks/useImAccount';
import { useMintBillboard } from '../../hooks/useMintBillboard';
import { HNFT_CONFIG } from '../../models/parami';
import BillboardNftImage from '../BillboardNftImage/BillboardNftImage';
import Confetti from '../Confetti/Confetti';
import MobileDrawer from '../MobileDrawer/MobileDrawer';
import './MintNFTModal.scss';
import { HNFT } from '../../hooks/useHNFT';
import { useBillboardPrices } from '../../hooks/useBillboardPrices';
import { amountToFloatString } from '../../utils/format.util';

export interface MintNFTModalProps {
    onCancel: () => void,
    hnft: HNFT
}

function MintNFTModal({ onCancel, hnft }: MintNFTModalProps) {
    const { imAccount } = useImAccount();
    const [selectedNft, setSelectedNft] = React.useState<{ level: number; name: string }>();
    const { mint, isSuccess: mintSuccess, isLoading: mintLoading, error: mintError, prepareError } = useMintBillboard(selectedNft?.level, imAccount?.twitterProfileImageUri ?? '');

    const prices = useBillboardPrices();

    const nfts = <>
        {imAccount && <>
            <div className='nfts'>
                {HNFT_CONFIG.map((nftOption, index) => {
                    const selectable = (!hnft.balance || Number(hnft.level) < index);
                    return <>
                        <div
                            className={`nft ${selectable ? 'selectable' : ''}`}
                            key={index}
                            onClick={() => {
                                if (selectable) {
                                    setSelectedNft(nftOption)
                                }
                            }}
                        >
                            <div className='nft-image-container'>
                                <BillboardNftImage
                                    imageUrl={imAccount.twitterProfileImageUri}
                                    level={nftOption.level}
                                    active={selectable}
                                    selected={nftOption.level === selectedNft?.level}
                                ></BillboardNftImage>
                            </div>
                            <div className='price'>
                                {prices[index] && prices[index] !== '0' && <>
                                    {hnft.onWhitelist && index === 1 && <>
                                        free
                                    </>}
                                    {(!hnft.onWhitelist || index !== 1) && <>
                                        {amountToFloatString(prices[index])} $AD3
                                    </>}
                                </>}
                                {prices[index] === '0' && <>
                                    free
                                </>}
                            </div>
                            <div className='name'>{nftOption.name}</div>
                        </div>
                    </>
                })}
            </div>
        </>}

    </>;

    const actionBtn = <>
        {mintSuccess && <>
            <div className='action-btn-primary active' onClick={() => {
                onCancel();
            }}>Done</div>
        </>}

        {!mintSuccess && <>
            {(prepareError || !mint || !selectedNft) && <>
                <Tooltip title={selectedNft ? 'insufficient $AD3' : 'please select NFT'}>
                    <div className='action-btn-primary disabled'>Mint</div>
                </Tooltip>
            </>}

            {!prepareError && mint && <>
                <div className='action-btn-primary active' onClick={() => {
                    if (selectedNft && mint) {
                        mint()
                    }
                }}>Mint</div>
            </>}
        </>}
    </>;

    const success = <>
        {imAccount && selectedNft && <>
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
    </>

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
                            <div className='title'>{hnft.balance ? 'Upgrade' : 'Mint'} My HNFT</div>
                        </div>
                        <div className='sub-title'>
                            This NFT supports hyperlinks, and you can define the link content yourself
                        </div>
                    </div>
                    <div className='content'>
                        {imAccount && !mintSuccess && <>
                            {nfts}
                        </>}

                        {imAccount && mintSuccess && selectedNft && <>
                            {success}
                        </>}
                    </div>
                    <div className='footer'>
                        <div className='divider'></div>
                        {actionBtn}
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
                    {imAccount && !mintSuccess && <>
                        {nfts}
                    </>}

                    {imAccount && mintSuccess && selectedNft && <>
                        {success}
                    </>}

                    <div className='btn-container'>
                        {actionBtn}
                    </div>
                </div>
            </MobileDrawer>
        </>}
    </>;
};

export default MintNFTModal;
