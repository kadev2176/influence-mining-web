import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Typography, Image } from 'antd';
import { useHnftSetLinkTo } from '../../hooks/useSetHnftLink';
import { applyForDao, getAvailableDaos } from '../../services/mining.service';
import { useAccount, useNetwork } from 'wagmi';
import { formatTwitterImageUrl } from '../../utils/format.util';

const { Title } = Typography;

export interface InfluenceMiningProps { }

function InfluenceMining({ }: InfluenceMiningProps) {
    const { address } = useAccount();
    const { chain } = useNetwork();
    const [daos, setDaos] = useState<any[]>();
    const [selectedDao, setSelectedDao] = useState<any>(); // todo: type this
    const { setLinkTo, isLoading, isSuccess } = useHnftSetLinkTo(selectedDao?.address, selectedDao?.tokenId);

    // todo: user already joined

    useEffect(() => {
        // get available daos
        getAvailableDaos(address!, chain!.id).then(res => {
            setDaos(res as any);
        });
    }, []);

    useEffect(() => {
        if (selectedDao && setLinkTo) {
            setLinkTo();
        }
    }, [selectedDao]);

    useEffect(() => {
        if (isSuccess) {
            applyForDao(selectedDao.address, selectedDao.tokenId);
        }
    }, [isSuccess]);

    return <>
        <Title level={2}>Select DAO to join</Title>
        <div>
            {daos && daos.length > 0 && <>
                {daos.map(dao => {
                    return <>
                        <Row style={{color: '#ffffff'}}>
                            <Col>
                                <Image style={{height: '100px'}} src={formatTwitterImageUrl(dao.twitterProfileImageUri)} referrerPolicy={'no-referrer'}></Image>
                            </Col>
                            <Col>
                                <div>Kai's Dao</div>
                                <div>Influence: 1000</div>
                                <div>2000+ members</div>
                                <div>300k $KaiSIT offered</div>
                                <div>
                                    <Button type='primary' onClick={() => {

                                    }}>Apply</Button>
                                </div>
                            </Col>
                        </Row>
                    </>
                })}
            </>}
        </div>
    </>;
};

export default InfluenceMining;
