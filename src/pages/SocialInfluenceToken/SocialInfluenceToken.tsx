import { Avatar, Button, List, notification, Skeleton, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useApiWs } from '../../hooks/useApiWs';
import { useHNFT } from '../../hooks/useHNFT';
import { PARAMI_WALLET, POST_MESSAGE } from '../../models/parami';
import { createInfluenceMiningPool } from '../../services/mining.service';
import { getAssetMetadataOfNftId, getNftMetadata, getPortedNftIdOfHnft, getSwapMetadataOfNftId } from '../../services/parami.service';
import { openPopup, subscribePostMessage } from '../../utils/window.util';

const { Title } = Typography;

export interface SocialInfluenceTokenProps { }

function SocialInfluenceToken({ }: SocialInfluenceTokenProps) {
    const hnft = useHNFT();
    const apiWs = useApiWs();
    const [paramiNftId, setParamiNftId] = useState<string>();
    const [paramiNft, setParamiNft] = useState<any>(); // todo: type this

    const queryParamiNft = async (nftId: string) => {
        const nftMetadata = await getNftMetadata(nftId);
        const swapMetadata = await getSwapMetadataOfNftId(nftId);
        const assetMetadata = await getAssetMetadataOfNftId(nftId);

        setParamiNft({
            nftId,
            minted: nftMetadata?.minted,
            swapReady: !!swapMetadata,
            liquidity: swapMetadata?.liquidity,
        })
    }

    useEffect(() => {
        if (apiWs && hnft.address && hnft.tokenId) {
            getPortedNftIdOfHnft(hnft.address, hnft.tokenId).then(nftId => {
                if (nftId) {
                    setParamiNftId(nftId);
                }
            })
        }
    }, [apiWs, hnft]);

    useEffect(() => {
        if (paramiNftId) {
            queryParamiNft(paramiNftId);
        }
    }, [paramiNftId]);

    return <>
        <Title level={3}>Create DAO and claim your SIT!</Title>
        {!paramiNft && <>
            <Button type='primary' onClick={() => {
                openPopup(`${PARAMI_WALLET}/enlist/${hnft.address}/${hnft.tokenId}`);
                subscribePostMessage(() => {
                    notification.success({
                        message: 'Import NFT Success'
                    });
                    queryParamiNft(paramiNftId!);
                }, event => event.origin === PARAMI_WALLET && event.data === POST_MESSAGE.NFT_IMPORTED)
            }}>Import your NFT</Button>
        </>}

        {!!paramiNft && <>
            {!paramiNft.minted && <>
                <div>
                    <Button type='primary' onClick={() => {
                        openPopup(`${PARAMI_WALLET}/quickMint/${paramiNft.nftId}`);
                        subscribePostMessage(() => {
                            notification.success({
                                message: 'Claim SIT Success'
                            });
                            queryParamiNft(paramiNftId!);
                        }, event => event.origin === PARAMI_WALLET && event.data === POST_MESSAGE.NFT_MINT)
                    }}>
                        Claim your SIT
                    </Button>
                </div>
            </>}

            {paramiNft.minted && <>
                <div>
                    <Title level={3}>DAO stat</Title>
                    <div style={{ color: '#ffffff' }}>
                        <p>Nft image</p>
                        <p>Kai's DAO</p>
                        <p>SIT supply, price</p>
                        <p>DAO members</p>
                        <p>Liquidity Pool status</p>
                        <p>Influence Mining Pool status</p>
                    </div>
                </div>

                {!paramiNft.liquidity && <>
                    <div>
                        <Button type='primary' onClick={() => {
                            openPopup(`${PARAMI_WALLET}/quickAddLiquidity/${paramiNft.nftId}`);
                            subscribePostMessage(() => {
                                notification.success({
                                    message: 'Liquidity Added'
                                });
                                queryParamiNft(paramiNftId!);
                            }, event => event.origin === PARAMI_WALLET && event.data === POST_MESSAGE.ADD_LIQUIDITY)
                        }}>Add Liquidity</Button>
                    </div>
                </>}

                {!!paramiNft.liquidity && <>
                    <div>
                        <Button type='primary' onClick={() => {
                            openPopup(`${PARAMI_WALLET}/quickCreateIMPool/${paramiNft.nftId}`);
                            subscribePostMessage(async () => {
                                await createInfluenceMiningPool();
                                notification.success({
                                    message: 'Influence Mining Pool Created'
                                });
                                queryParamiNft(paramiNftId!);
                            }, event => event.origin === PARAMI_WALLET && event.data === POST_MESSAGE.IM_POOL_CREATED);
                        }}>Create Influence Mining Pool</Button>
                    </div>
                    <div>
                        <Button type='primary'>Setup staking reward</Button>
                    </div>
                </>}
            </>}
        </>}
    </>;
};

export default SocialInfluenceToken;
