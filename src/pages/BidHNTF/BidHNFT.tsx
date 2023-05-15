import React, { useEffect, useState } from 'react';
import {
  Button,
  Input,
  Form,
  message,
  Upload,
  InputNumber,
  Collapse,
  Select,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import has from 'lodash/has';
import { compressImageFile } from '../../utils/upload.util';
import type { UploadFile } from 'antd/es/upload/interface';
import UserAvatar from '../../components/UserAvatar/UserAvatar';
import styles from './BidHNFT.module.scss';
import { useApproveAD3 } from '../../hooks/useApproveAD3';
import { AuctionContractAddress, EIP5489ForInfluenceMiningContractAddress } from '../../models/parami';
import { inputFloatStringToAmount } from '../../utils/format.util';
import { usePreBid } from '../../hooks/usePreBid';
import { useAuctionEvent } from '../../hooks/useAuctionEvent';
import { useAuthorizeSlotTo } from '../../hooks/useAuthorizeSlotTo';
import { useApproveHnft } from '../../hooks/useApproveHnft';
import { useAccount } from 'wagmi';
import { BidWithSignature, createBid } from '../../services/bid.service';
import { useImAccount } from '../../hooks/useImAccount';
import { useCommitBid } from '../../hooks/useCommitBid';

const { Panel } = Collapse;
const { Option } = Select;

interface BidHNFTProps { }

export enum IMAGE_TYPE {
  ICON = 'icon',
  POSTER = 'poster',
}

export interface UserInstruction {
  text: string;
  tag?: string;
  score?: number;
  link?: string;
}

const defaultInstruction: UserInstruction = {
  text: 'Follow Parami on Twitter',
  tag: 'Twitter',
  score: 1,
  link: 'https://twitter.com/intent/follow?screen_name=ParamiProtocol',
};

const adMetadataUrl = 'https://ipfs.parami.io/ipfs/QmY3ttSmNBbcKPit8mJ1FLatcDDeNDhmkkYU9TnCEJSsjZ';

const BidHNFT: React.FC<BidHNFTProps> = (props) => {
  const [form] = Form.useForm();
  const { imAccount } = useImAccount();
  const { address } = useAccount();
  const [content, setContent] = useState<string>('View Ads. Get Paid.');
  const [iconUploadFiles, setIconUploadFiles] = useState<UploadFile[]>([]);
  const [posterUploadFiles, setPosterUploadFiles] = useState<UploadFile[]>([]);
  const { approve, isSuccess: approveSuccess } = useApproveAD3(AuctionContractAddress, inputFloatStringToAmount('10'));
  const [hnft, setHnft] = useState<any>({ address: EIP5489ForInfluenceMiningContractAddress, tokenId: '1' }); // todo: get hnft from url params
  const { authorizeSlotTo, isSuccess: authorizeSlotToSuccess, currentSlotManager } = useAuthorizeSlotTo(hnft.tokenId, AuctionContractAddress);
  const { preBid, isSuccess: preBidSuccess, prepareError: preBidPrepareError } = usePreBid(hnft.address, hnft.tokenId);
  const [bidPreparedEvent, setBidPreparedEvent] = useState<any>();
  const { unwatch } = useAuctionEvent('BidPrepared', (hNFTContractAddr: string, curBidId: string, preBidId: string, bidder: string) => {
    setBidPreparedEvent({
      bidder,
      curBidId,
      preBidId
    })
  });

  const { approve: hnftApprove } = useApproveHnft(AuctionContractAddress, hnft.tokenId);
  const [bidWithSig, setBidWithSig] = useState<BidWithSignature>();
  const { commitBid, isSuccess: commitBidSuccess } = useCommitBid(hnft.tokenId, hnft.address, inputFloatStringToAmount('10'), adMetadataUrl, bidWithSig?.sig, bidWithSig?.id, bidWithSig?.prev_bid_id, '0');
  const commitBidReady = !!commitBid;

  useEffect(() => {
    if (bidWithSig && commitBidReady) {
      commitBid?.();
    }
  }, [bidWithSig, commitBidReady])

  useEffect(() => {
    if (commitBidSuccess) {
      console.log('commit bid success!!');
    }
  }, [commitBidSuccess])

  useEffect(() => {
    if (bidPreparedEvent && bidPreparedEvent.bidder) {
      // todo: create adMeta
      console.log('bid prepare event done. create bid now...');
      createBid(imAccount?.id ?? '26', 1, EIP5489ForInfluenceMiningContractAddress, hnft.tokenId, inputFloatStringToAmount('10'), inputFloatStringToAmount('10')).then((bidWithSig) => {
        console.log('create bid got sig', bidWithSig);
        setBidWithSig(bidWithSig);
      })
    }
  }, [bidPreparedEvent]);

  useEffect(() => {
    console.log('currentSlotManager', currentSlotManager)
  }, [currentSlotManager])

  useEffect(() => {
    if (preBidPrepareError) {
      console.log('prebid prepare error', preBidPrepareError)
    }
  }, [preBidPrepareError])

  const uploadProps = {
    name: 'file',
    // crossOrigin: 'anonymous',
    headers: {
      authorization: 'authorization-text',
      origin: 'gptminer.io',
      'Referrer-Policy': 'no-referrer'
    },
    action: 'https://ipfs.parami.io/api/v0/add?stream-channels=true',
    withCredentials: true,
    showUploadList: { showPreviewIcon: false },
    multiple: false,
    maxCount: 1,
  };

  const onFinish = (values: any) => {
    message.success('Submit success!');
  };

  const handelValuesChanged = (changedValues: any) => {
    if (has(changedValues, 'content')) {
      setContent(changedValues.content);
    }
  };

  const handleBeforeUpload = (imageType: IMAGE_TYPE) => {
    return async (file: any) => {
      return await compressImageFile(file, imageType);
    };
  };

  const handleUploadOnChange = (imageType: IMAGE_TYPE) => {
    return (info: any) => {
      const { fileList } = info;
      console.log(info, '---info----');

      if (info.file.status === 'done') {
        // const ipfsHash = info.file.response.Hash;
        // const imageUrl = config.ipfs.endpoint + ipfsHash;
        // fileList[0].url = imageUrl;
      }
      if (info.file.status === 'error') {
        message.error('Upload Image Error');
      }
      imageType === IMAGE_TYPE.POSTER
        ? setPosterUploadFiles(fileList)
        : setIconUploadFiles(fileList);
    };
  };

  const handleBid = () => {
    console.log('bid: handle bid');
    approve?.()
  };

  useEffect(() => {
    if (authorizeSlotToSuccess) {
      console.log('bid: pre bid after authorize');
      preBid?.();
    }
  }, [authorizeSlotToSuccess])

  useEffect(() => {
    if (approveSuccess) {
      if (currentSlotManager && currentSlotManager.toLowerCase() === AuctionContractAddress.toLowerCase()) {
        console.log('bid: pre bid direct');
        preBid?.();
      } else {
        authorizeSlotTo?.();
      }
    }
  }, [approveSuccess])

  return (
    <div className={styles.bidAdContainer}>
      {/* <div className='action-btn-primary active' onClick={() => {
        hnftApprove?.();
      }}>Approve</div> */}
      <div className='ad-header'>
        <div>Bid on HNFT</div>
        <span>Place your advertisement on HNFTs</span>
      </div>
      <div className='ad-content'>
        <div className='ad-form'>
          <div className='title'>Config your Ad</div>
          <Form
            form={form}
            layout='vertical'
            onFinish={onFinish}
            autoComplete='off'
            onValuesChange={handelValuesChanged}
          >
            <Form.Item
              name='content'
              label='Content'
              required
              initialValue={content}
            >
              <Input className='ad-form-item' bordered={false} />
            </Form.Item>
            <Form.Item name='adIcon' label='Ad icon' required>
              <Upload
                {...uploadProps}
                fileList={iconUploadFiles}
                listType='picture'
                onChange={handleUploadOnChange(IMAGE_TYPE.ICON)}
                beforeUpload={handleBeforeUpload(IMAGE_TYPE.ICON)}
              >
                <Button icon={<UploadOutlined />} className='ad-form-upload'>
                  Click to Upload
                </Button>
              </Upload>
            </Form.Item>
            <Form.Item name='poster' label='Poster' required>
              <Upload
                {...uploadProps}
                fileList={posterUploadFiles}
                listType='picture'
                onChange={handleUploadOnChange(IMAGE_TYPE.ICON)}
                beforeUpload={handleBeforeUpload(IMAGE_TYPE.ICON)}
              >
                <Button icon={<UploadOutlined />} className='ad-form-upload'>
                  Click to Upload
                </Button>
              </Upload>
            </Form.Item>
            <Form.Item name='instruction' label='Instruction' required>
              <div className='instruction'>
                <span>{defaultInstruction.text}</span>
                <a className='follow-twitter' href={defaultInstruction.link}>
                  {defaultInstruction.tag}
                </a>
                <span>+1</span>
              </div>
            </Form.Item>
            <Collapse ghost>
              <Panel header='Advanced Settings' key='1'>
                <Form.Item name='reward-rate' label='Reward Rate' required>
                  <InputNumber
                    min={0}
                    max={100}
                    className='ad-form-item'
                    bordered={false}
                  />
                </Form.Item>
                <Form.Item name='lifetime' label='lifetime' required>
                  <Select
                    size='large'
                    style={{
                      width: '100%',
                    }}
                    defaultValue={1}
                    popupClassName={styles.lifetimePopup}
                    value={1}
                    className='ad-form-item'
                  >
                    <Option value={1}>1 DAY</Option>
                    <Option value={3}>3 DAYS</Option>
                    <Option value={7}>7 DAYS</Option>
                    <Option value={15}>15 DAYS</Option>
                  </Select>
                </Form.Item>
                <Form.Item name='payout-base' label='Payout Base' required>
                  <InputNumber
                    min={0}
                    max={100}
                    className='ad-form-item'
                    bordered={false}
                  />
                </Form.Item>
                <Form.Item name='payout-min' label='Payout Min' required>
                  <InputNumber
                    min={0}
                    max={100}
                    className='ad-form-item'
                    bordered={false}
                  />
                </Form.Item>
                <Form.Item name='payout-max' label='Payout Max' required>
                  <InputNumber
                    min={0}
                    max={100}
                    className='ad-form-item'
                    bordered={false}
                  />
                </Form.Item>
              </Panel>
            </Collapse>
          </Form>
        </div>
        <div className='ad-preview'>
          <div className='title'>Ad Preview</div>
          <div className='content'>
            <div className='header'>
              <UserAvatar src={''} className='avatar' />
              <div className='sponsor-desc'>
                <span>is sponsoring this hNFT. </span>
                <a className='bidLink' href='wwww.baidu.com' target='_blank'>
                  Bid on this ad space
                </a>
              </div>
            </div>
            <div className='section'>
              <div className='arrow'></div>
              <div className='ad-title' title={content}>
                {content}
              </div>
              <div
                className='ad-poster'
                style={{
                  backgroundImage: 'url(/assets/images/rare_wall_bg.png)',
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div className='ad-footer'>
        <div className='title'>Bid your price</div>
        <div className='bid-nfts'>
          <div className='bid-nfts-title'>Nfts</div>
          <Input className='bid-nfts-input' bordered={false} />
          <div className='action-btn-primary active bid-button' onClick={() => {
            handleBid();
          }}>Bid</div>
        </div>
      </div>
    </div>
  );
};

export default BidHNFT;
