import React, { useState } from 'react';
import { Typography, Button } from 'antd';
import { PARAMI_WALLET } from '../../models/parami';
import { useHNFT } from '../../hooks/useHNFT';
import { useEffect } from 'react';
import { getNFTIdsOfOwnerDid } from '../../services/subquery.service';
import { useApiWs } from '../../hooks/useApiWs';
import { getParamiNftExternal } from '../../services/parami.service';

const { Title } = Typography;

export interface BidWarProps { }

function BidWar({ }: BidWarProps) {
    const hnft = useHNFT();
    const [did, setDid] = useState<string | null>(window.localStorage.getItem('did'));
    const [nftIds, setNftIds] = useState<string[]>();
    const [importedNftId, setImportedNftId] = useState<string>();
    const apiWs = useApiWs();

    useEffect(() => {
        if (did) {
            getNFTIdsOfOwnerDid(did).then(nftIds => {
                return nftIds ?? [];
            }).then(nftIds => {
                if (!nftIds.length) {
                    return []
                }

                return Promise.all(nftIds.map(nftId => getParamiNftExternal(nftId))).then(nfts => {
                    return nfts.map((nft, index) => {
                        return {
                            ...nft,
                            paramiNftId: nftIds[index]
                        }
                    })
                })
            }).then(externalNfts => {
                externalNfts.forEach(nft => {
                    if (nft && nft.tokenId === hnft.tokenId && nft.address?.toLowerCase() === hnft.address?.toLowerCase()) {
                        setImportedNftId(nft.paramiNftId);
                    }
                })
            })
        }
    }, [did])

    const findHnft = async (nftIds: string[]) => {
        getParamiNftExternal(nftIds[0]).then(nft => {
            console.log('got external nft', nft);
        })
    }

    useEffect(() => {
        if (nftIds?.length && apiWs) {
            findHnft(nftIds);
        }
    }, [nftIds, apiWs])

    return <>
        <Title level={3}>Bid War</Title>
        <div className='btn-container'>
            {hnft && !importedNftId && <>
                <Button type='primary'
                    onClick={() => {
                        window.open(`${PARAMI_WALLET}/enlist/${hnft.address}/${hnft.tokenId}`);
                        window.addEventListener('message', (event) => {
                            if (event.origin === 'http://local.parami.io:1024') {
                                if (event.data.startsWith('did:')) {
                                    const did = event.data.slice(4);
                                    window.localStorage.setItem('did', did)
                                    setDid(did);
                                }
                            }
                        })
                    }}
                >Enlist Now</Button>
            </>}

            {hnft && !!importedNftId && <>
                <Button type='primary'>Bid on others</Button>
            </>}
        </div>
    </>;
};

export default BidWar;
