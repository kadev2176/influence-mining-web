import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Typography, Image, Spin, notification } from 'antd';
import { applyForDao, approveDaoApplication, exitDao, getAvailableDaos, getDaoApplicationOfWallet, getPendingApplicationsForMe, ImAccount } from '../../services/mining.service';
import { useAccount, useNetwork } from 'wagmi';
import { useImAccount } from '../../hooks/useImAccount';
import BillboardNftImage from '../../components/BillboardNftImage/BillboardNftImage';
import { useHnftLinkTo } from '../../hooks/useSetHnftLink';
import { useHNFT } from '../../hooks/useHNFT';

const { Title } = Typography;

export interface InfluenceMiningProps { }

function InfluenceMining({ }: InfluenceMiningProps) {
    const { address } = useAccount();
    const { chain } = useNetwork();
    const [daos, setDaos] = useState<ImAccount[]>();
    const [selectedDao, setSelectedDao] = useState<ImAccount>(); // todo: type this
    const hnft = useHNFT();
    const { linkTo, isLoading, isSuccess, isError, error } = useHnftLinkTo(hnft?.tokenId, selectedDao?.hnftTokenId);

    const [currentDaoApplication, setCurrentDaoApplication] = useState<any>(); // todo: type this
    const [pendingApplications, setPendingApplications] = useState<any>(); // todo: type application

    const { imAccount, loading } = useImAccount();

    useEffect(() => {
        if (error) {
            notification.error({
                message: error.message
            })
            setSelectedDao(undefined);
        }
    }, [error])

    useEffect(() => {
        getAvailableDaos(address!, chain!.id).then(daos => {
            console.log('available daos', daos);
            setDaos(daos);
        });

        getDaoApplicationOfWallet(address!, chain!.id).then(res => {
            console.log('my application', res);
            setCurrentDaoApplication(res);
        })

        getPendingApplicationsForMe(address!, chain!.id).then(res => {
            setPendingApplications(res);
            console.log('pending applications for me', res);
        })
    }, []);

    useEffect(() => {
        if (selectedDao && linkTo) {
            linkTo();
        }
    }, [selectedDao]);

    useEffect(() => {
        if (isSuccess) {
            applyForDao(address!, chain!.id, selectedDao!.wallet, selectedDao!.chainId);
            setSelectedDao(undefined);
            // todo: refresh
        }
    }, [isSuccess]);

    return <>
        <Spin spinning={!imAccount || loading || isLoading}>
            {imAccount && <>
                {currentDaoApplication && <>
                    <Title level={3}>
                        Your current application <br></br>
                        status: {currentDaoApplication.status}
                    </Title>
                    <div>
                        {currentDaoApplication.status !== 'cancelled' && <>
                            <Button type='primary' onClick={() => {
                                exitDao(address!, chain!.id, currentDaoApplication.id);
                            }}>Exit</Button>
                        </>}
                    </div>
                </>}

                {pendingApplications && pendingApplications.length > 0 && <>
                    <Title level={3}>You have pending applications</Title>
                    {pendingApplications.map((application: any) => {
                        return <>
                            <Row key={application.id} style={{ color: '#ffffff' }}>
                                <Col>Application from {application.memberWallet}</Col>
                                <Col>
                                    <Button type="primary" onClick={() => {
                                        approveDaoApplication(address!, chain!.id, application.id);
                                    }}>Approve</Button>
                                </Col>
                            </Row>
                        </>
                    })}
                </>}
                {/* {imAccount.linkedTo && <>
                    <Title level={3} >
                        You are part of DAO {imAccount.linkedTo}
                    </Title>
                    <div>
                        <Button type='primary' onClick={() => {

                        }}>Exit</Button>
                    </div>
                </>} */}

                {!imAccount.linkedTo && <>
                    <Title level={2}>Select DAO to join</Title>
                    <div>
                        {daos && daos.length > 0 && <>
                            {daos.map(dao => {
                                return <>
                                    <Row style={{ color: '#ffffff' }} key={dao.wallet}>
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
