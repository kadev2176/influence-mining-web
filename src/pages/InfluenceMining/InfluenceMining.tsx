import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Typography, Image, Spin } from 'antd';
import { useHnftSetLinkTo } from '../../hooks/useSetHnftLink';
import { applyForDao, getAvailableDaos } from '../../services/mining.service';
import { useAccount, useNetwork } from 'wagmi';
import { useImAccount } from '../../hooks/useImAccount';
import BillboardNftImage from '../../components/BillboardNftImage/BillboardNftImage';

const { Title } = Typography;

export interface InfluenceMiningProps { }

function InfluenceMining({ }: InfluenceMiningProps) {
    const { address } = useAccount();
    const { chain } = useNetwork();
    const [daos, setDaos] = useState<any[]>();
    const [selectedDao, setSelectedDao] = useState<any>(); // todo: type this
    const { setLinkTo, isLoading, isSuccess } = useHnftSetLinkTo(selectedDao?.address, selectedDao?.tokenId);

    const { imAccount, loading } = useImAccount();

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
        <Spin spinning={!imAccount || loading}>
            {imAccount && <>
                {imAccount.linkedTo && <>
                    <Title level={3} >
                        You are part of DAO {imAccount.linkedTo}
                    </Title>
                    <div>
                        <Button type='primary' onClick={() => {

                        }}>Exit</Button>
                    </div>
                </>}

                {!imAccount.linkedTo && <>
                    <Title level={2}>Select DAO to join</Title>
                    <div>
                        {daos && daos.length > 0 && <>
                            {daos.map(dao => {
                                return <>
                                    <Row style={{ color: '#ffffff' }}>
                                        <Col>
                                            <div style={{ width: '200px' }}>
                                                <BillboardNftImage imageUrl={dao.twitterProfileImageUri}></BillboardNftImage>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div>Kai's Dao</div>
                                            <div>Influence: {dao.influence}</div>
                                            <div>2000+ members</div>
                                            <div>300k $KaiSIT offered</div>
                                            <div>
                                                <Button type='primary' onClick={() => {
                                                    setSelectedDao(dao);
                                                }}>Apply</Button>
                                            </div>
                                        </Col>
                                    </Row>
                                </>
                            })}
                        </>}
                    </div>
                </>}
            </>}
        </Spin>

    </>;
};

export default InfluenceMining;
