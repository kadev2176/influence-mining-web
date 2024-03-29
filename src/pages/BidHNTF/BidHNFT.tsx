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
import { useCurBid } from '../../hooks/useCurrentBid';
import { uploadIPFS } from '../../services/ipfs.service';

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

interface AdMeta {
  icon?: string;
  poster?: string;
  title?: string;
  tag?: string;
  url?: string;
}

const mockAdData = {
  icon: 'https://pbs.twimg.com/profile_images/1611305582367215616/4W9XpGpU.jpg',
  poster: 'https://pbs.twimg.com/media/FqlTSTOWYAA7yKN?format=jpg&name=small',
  title: 'Tweeting is Mining!',
  tag: 'twitter',
  url: 'https://twitter.com/ParamiProtocol'
}

// const adMetadataUrl = 'https://ipfs.parami.io/ipfs/QmY3ttSmNBbcKPit8mJ1FLatcDDeNDhmkkYU9TnCEJSsjZ';

const BidHNFT: React.FC<BidHNFTProps> = (props) => {
  const [form] = Form.useForm();
  const { imAccount } = useImAccount();
  const { address } = useAccount();
  const [content, setContent] = useState<string>('View Ads. Get Paid.');
  const [adMetadataUrl, setAdMetadataUrl] = useState<string>();
  const [iconUploadFiles, setIconUploadFiles] = useState<UploadFile[]>([]);
  const [posterUploadFiles, setPosterUploadFiles] = useState<UploadFile[]>([]);
  const { approve, isSuccess: approveSuccess } = useApproveAD3(AuctionContractAddress, inputFloatStringToAmount('20')); // approve amount = min_deposite_amount + new_bid_price
  const [hnft, setHnft] = useState<any>({ address: EIP5489ForInfluenceMiningContractAddress, tokenId: '1' }); // todo: get hnft from url params
  const { authorizeSlotTo, isSuccess: authorizeSlotToSuccess, currentSlotManager } = useAuthorizeSlotTo(hnft.tokenId, AuctionContractAddress);
  const { preBid, isSuccess: preBidSuccess, prepareError: preBidPrepareError } = usePreBid(hnft.address, hnft.tokenId);
  const preBidReady = !!preBid;
  const curBid = useCurBid(hnft.address, hnft.tokenId);
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
  const { commitBid, isSuccess: commitBidSuccess } = useCommitBid(hnft.tokenId, hnft.address, inputFloatStringToAmount('10'), adMetadataUrl, bidWithSig?.sig, bidWithSig?.prev_bid_id, bidWithSig?.id, bidWithSig?.last_bid_remain);
  const commitBidReady = !!commitBid;

  useEffect(() => {
    if (bidWithSig && commitBidReady) {
      commitBid?.();
    }
  }, [bidWithSig, commitBidReady])

  useEffect(() => {
    if (commitBidSuccess) {
      // todo: refresh and clear state
      console.log('commit bid success!!');
    }
  }, [commitBidSuccess])

  // direct bid for testing
  // useEffect(() => {
  //   createBid(imAccount?.id ?? '26', 1, EIP5489ForInfluenceMiningContractAddress, hnft.tokenId, inputFloatStringToAmount('10')).then((bidWithSig) => {
  //     console.log('create bid got sig', bidWithSig);
  //     setBidWithSig(bidWithSig);
  //   })
  // }, [])

  // upload mock ad data
  useEffect(() => {
    uploadIPFS(mockAdData).then(res => {
      console.log('upload ipfs res', res);
      setAdMetadataUrl(`https://ipfs.parami.io/ipfs/${res.Hash}`)
    })
  }, [])

  useEffect(() => {
    if (bidPreparedEvent && bidPreparedEvent.bidder) {
      // todo: create adMeta
      console.log('bid prepare event done. create bid now...');
      createBid(imAccount?.id ?? '26', 1, EIP5489ForInfluenceMiningContractAddress, hnft.tokenId, inputFloatStringToAmount('10')).then((bidWithSig) => {
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
      // authorization: 'authorization-text',
      // origin: 'gptminer.io',
      // 'Referrer-Policy': 'no-referrer'
    },
    action: 'https://ipfs.parami.io/api/v0/add?stream-channels=true',
    withCredentials: false,
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
        const ipfsHash = info.file.response.Hash;
        const imageUrl = 'https://ipfs.parami.io/ipfs/' + ipfsHash;
        fileList[0].url = imageUrl;
      }
      if (info.file.status === 'error') {
        message.error('Upload Image Error');
      }
      console.log('upload done', fileList);
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
    if (approveSuccess && preBidReady) {
      if (currentSlotManager && currentSlotManager.toLowerCase() === AuctionContractAddress.toLowerCase()) {
        console.log('bid: pre bid direct');
        preBid?.();
      } else {
        authorizeSlotTo?.();
      }
    }
  }, [approveSuccess, preBidReady])

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
                onChange={handleUploadOnChange(IMAGE_TYPE.POSTER)}
                beforeUpload={handleBeforeUpload(IMAGE_TYPE.POSTER)}
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
          <div className='bid-nfts-content'>
            <div className='bid-nfts-content-header'>
              <div className='bid-nfts-content-header-item'>
                HNFT
              </div>
              <div className='bid-nfts-content-header-item'>
                Min Price
              </div>
              <div className='bid-nfts-content-header-item'>
                Offer a price
              </div>
            </div>
            <div className='bid-nfts-content-body'>
              <div className='bid-nfts-content-body-item'>
                XPC
              </div>
              <div className='bid-nfts-content-body-item'>
                0.1
              </div>
              <div className='bid-nfts-content-body-item'>
                <Input className='bid-nfts-body-input' bordered={false} />
              </div>
            </div>
          </div>
          <div className='action-btn-primary active bid-button' onClick={() => {
            handleBid();
          }}>Bid</div>
        </div>
      </div>
    </div>
  );
};

export default BidHNFT;
