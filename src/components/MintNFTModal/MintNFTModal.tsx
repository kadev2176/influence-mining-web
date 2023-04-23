import { Modal, notification, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
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
import { BigNumber } from 'ethers';
import { useApproveAD3 } from '../../hooks/useApproveAD3';
import { useUpgradeBillboard } from '../../hooks/useUpgradeBillboard';
import LoadingBar from '../LoadingBar/LoadingBar';

export interface MintNFTModalProps {
    onCancel: () => void,
    hnft: HNFT,
    onSuccess: () => void,
}

function MintNFTModal({ onCancel, hnft, onSuccess }: MintNFTModalProps) {
    const { imAccount } = useImAccount();
    const [selectedNft, setSelectedNft] = useState<{ level: number; name: string }>();
    const [priceDiff, setPriceDiff] = useState<string>('');
    const { mint, isSuccess: mintSuccess, isLoading: mintLoading, error: mintError, prepareError: mintPrepareError } = useMintBillboard(selectedNft?.level, imAccount?.twitterProfileImageUri ?? '');
    const { upgradeHnft, isSuccess: upgradeSuccess, isLoading: upgradeLoading, error: upgradeError, prepareError: upgradePrepareError } = useUpgradeBillboard(hnft.tokenId, selectedNft?.level);
    const { approve, isLoading: approveLoading, isSuccess: approveSuccess, error: approveError, prepareError: approveAd3PrepareError } = useApproveAD3(priceDiff);

    const prices = useBillboardPrices();

    const isSuccess = mintSuccess || upgradeSuccess;

    useEffect(() => {
        if (isSuccess) {
            onSuccess();
        }
    }, [isSuccess])

    useEffect(() => {
        if (hnft.balance && upgradeHnft) {
            upgradeHnft();
        } else if (!hnft.balance && mint) {
            mint();
        }
    }, [approveSuccess]);

    useEffect(() => {
        if (selectedNft) {
            if (selectedNft.level === 1 && hnft.onWhitelist) {
                return;
            }
            const priceDiff = BigNumber.from(prices[selectedNft.level]).sub(prices[Number(hnft.level!)]).toString();
            setPriceDiff(priceDiff);
        }
    }, [selectedNft]);

    const nfts = <>
        {imAccount && <>
            <div className='nfts'>
                {(mintLoading || upgradeLoading || approveLoading) && <>
                    <LoadingBar></LoadingBar>
                </>}
                {!(mintLoading || upgradeLoading || approveLoading) && <>
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
                </>}
            </div>
        </>}
    </>;

    const actionBtn = <>
        {isSuccess && <>
            <div className='action-btn-primary active' onClick={() => {
                onCancel();
            }}>Done</div>
        </>}

        {!isSuccess && <>
            {!selectedNft && <>
                <Tooltip title={'please select NFT'}>
                    <div className='action-btn-primary disabled'>{hnft.balance ? 'Upgrade' : 'Mint'}</div>
                </Tooltip>
            </>}

            {selectedNft && <>
                {!!hnft.balance && <>
                    {(!upgradeHnft && !approve) && <>
                        <Tooltip title={'insufficient $AD3'}>
                            <div className='action-btn-primary disabled'>Upgrade</div>
                        </Tooltip>
                    </>}

                    {(upgradeHnft || approve) && <>
                        <div className='action-btn-primary active' onClick={() => {
                            if (Number(priceDiff) > 0 && approve) {
                                approve();
                            } else if (upgradeHnft) {
                                upgradeHnft();
                            }
                        }}>Upgrade</div>
                    </>}
                </>}

                {!hnft.balance && <>
                    {(!mint && !approve) && <>
                        <Tooltip title={'insufficient $AD3'}>
                            <div className='action-btn-primary disabled'>Mint</div>
                        </Tooltip>
                    </>}

                    {(mint || approve) && <>
                        <div className='action-btn-primary active' onClick={() => {
                            if (Number(priceDiff) > 0 && approve) {
                                approve();
                            } else if (mint) {
                                mint();
                            }
                        }}>Mint</div>
                    </>}
                </>}
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
                        {imAccount && !isSuccess && <>
                            {nfts}
                        </>}

                        {imAccount && isSuccess && <>
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
                    <div className='title'>{hnft.balance ? 'Upgrade' : 'Mint'} My HNFT</div>
                    <div className='sub-title'>
                        This NFT supports hyperlinks, and you can define the link content yourself
                    </div>
                    {imAccount && !isSuccess && <>
                        {nfts}
                    </>}

                    {imAccount && isSuccess && <>
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
