import React, { useState } from 'react';
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
import type { UploadFile } from 'antd/es/upload/interface';
import UserAvatar from '../../components/UserAvatar/UserAvatar';
import styles from './BidHNFT.module.scss';

const { Panel } = Collapse;
const { Option } = Select;

interface BidHNFTProps {}

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

interface PersonInfoProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
  > {
  label: string;
  size?: string;
}

const defaultInstruction: UserInstruction = {
  text: 'Follow Parami on Twitter',
  tag: 'Twitter',
  score: 1,
  link: 'https://twitter.com/intent/follow?screen_name=ParamiProtocol',
};

const BidHNFT: React.FC<BidHNFTProps> = (props) => {
  const [form] = Form.useForm();
  const { getFieldValue } = form;
  const [content, setContent] = useState<string>('View Ads. Get Paid.');
  const [iconUploadFiles, setIconUploadFiles] = useState<UploadFile[]>([]);
  const [posterUploadFiles, setPosterUploadFiles] = useState<UploadFile[]>([]);

  const uploadProps = {
    name: 'file',
    action: 'https://ipfs.parami.io/api/v0/add?stream-channels=true',
    // listType: 'picture',
    showUploadList: { showPreviewIcon: false },
    multiple: false,
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: (percent: any) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
  };

  const onFinish = (values: any) => {
    message.success('Submit success!');
  };

  const handelValuesChanged = (changedValues: any) => {
    if (has(changedValues, 'content')) {
      setContent(changedValues.content);
    }
    console.log(changedValues, '---changedValues---');
  };

  const handleBeforeUpload = (imageType: IMAGE_TYPE) => {
    return async (file: any) => {
      console.log(file, '---file---');
      // return await compressImageFile(file, imageType);
    };
  };

  const handleUploadOnChange = (imageType: IMAGE_TYPE) => {
    return (info: any) => {
      const { fileList } = info;
      console.log(info, '---info---');

      //   if (info.file.status === 'done') {
      //     const ipfsHash = info.file.response.Hash;
      //     const imageUrl = config.ipfs.endpoint + ipfsHash;
      //     fileList[0].url = imageUrl;
      //   }
      //   if (info.file.status === 'error') {
      //     message.error('Upload Image Error');
      //   }
      //   imageType === IMAGE_TYPE.POSTER
      //     ? setPosterUploadFiles(fileList)
      //     : setIconUploadFiles(fileList);
    };
  };

  return (
    <div className={styles.bidAdContainer}>
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
              <Input className='ad-form-item' />
            </Form.Item>
            <Form.Item name='adIcon' label='Ad icon' required>
              <Upload
                // fileList={iconUploadFiles}
                {...uploadProps}
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
                  <InputNumber min={0} max={100} className='ad-form-item' />
                </Form.Item>
                <Form.Item name='lifetime' label='lifetime' required>
                  <Select
                    size='large'
                    style={{
                      width: '100%',
                    }}
                    defaultValue={1}
                    // onChange={(value) => {
                    //   setLifetime(Number(value));
                    // }}
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
                  <InputNumber min={0} max={100} className='ad-form-item' />
                </Form.Item>
                <Form.Item name='payout-min' label='Payout Min' required>
                  <InputNumber min={0} max={100} className='ad-form-item' />
                </Form.Item>
                <Form.Item name='payout-max' label='Payout Max' required>
                  <InputNumber min={0} max={100} className='ad-form-item' />
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
          <Input className='bid-nfts-input' />
          <div className='action-btn-primary active bid-button'>Bid</div>
        </div>
      </div>
    </div>
  );
};

export default BidHNFT;
