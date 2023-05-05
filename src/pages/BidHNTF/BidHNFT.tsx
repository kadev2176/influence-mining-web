import React, { useState } from 'react';
import {
  Button,
  Input,
  Form,
  message,
  Upload,
  InputNumber,
  Collapse,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import has from 'lodash/has';
import type { UploadFile } from 'antd/es/upload/interface';
import UserAvatar from '../../components/UserAvatar/UserAvatar';
import styles from './BidHNFT.module.scss';
import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/checkbox/checkbox.js';
import { MdFilledButton } from '@material/web/button/filled-button';

const { Panel } = Collapse;

interface BidHNFTProps {}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'md-outlined-button': PersonInfoProps;
    }
  }
}

interface PersonInfoProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
  > {
  label: string;
  size?: string;
}

const BidHNFT: React.FC<BidHNFTProps> = (props) => {
  const [form] = Form.useForm();
  const { getFieldValue } = form;
  const [content, setContent] = useState<string>('View Ads. Get Paid.');
  const [iconUploadFiles, setIconUploadFiles] = useState<UploadFile[]>([]);
  const [posterUploadFiles, setPosterUploadFiles] = useState<UploadFile[]>([]);

  const onFinish = (values: any) => {
    message.success('Submit success!');
  };

  const handelValuesChanged = (changedValues: any) => {
    if (has(changedValues, 'content')) {
      setContent(changedValues.content);
    }
    console.log(changedValues, '---changedValues---');
  };

  return (
    <div className={styles.bidAdContainer}>
      <div className='ad-header'>
        <div>Bid on HNFT</div>
        <span>Place your advertisement on HNFTs</span>
      </div>
      <md-outlined-button label='Back'>back</md-outlined-button>
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
              <Input className='ad-form-content' />
            </Form.Item>
            <Form.Item name='adIcon' label='Ad icon' required>
              <Upload
                multiple={false}
                showUploadList={{ showPreviewIcon: false }}
                // fileList={iconUploadFiles}
                // action={config.ipfs.upload}
                listType='picture'
                // onChange={handleUploadOnChange(IMAGE_TYPE.ICON)}
                // beforeUpload={handleBeforeUpload(IMAGE_TYPE.ICON)}
              >
                <Button icon={<UploadOutlined />} className='ad-form-upload'>
                  Click to Upload
                </Button>
              </Upload>
            </Form.Item>
            <Form.Item name='poster' label='Poster' required>
              <Upload
                multiple={false}
                showUploadList={{ showPreviewIcon: false }}
                // fileList={iconUploadFiles}
                // action={config.ipfs.upload}
                listType='picture'
                // onChange={handleUploadOnChange(IMAGE_TYPE.ICON)}
                // beforeUpload={handleBeforeUpload(IMAGE_TYPE.ICON)}
              >
                <Button icon={<UploadOutlined />} className='ad-form-upload'>
                  Click to Upload
                </Button>
              </Upload>
            </Form.Item>
            <Form.Item name='instruction' label='Instruction' required>
              <Upload
                multiple={false}
                showUploadList={{ showPreviewIcon: false }}
                // fileList={iconUploadFiles}
                // action={config.ipfs.upload}
                listType='picture'
                // onChange={handleUploadOnChange(IMAGE_TYPE.ICON)}
                // beforeUpload={handleBeforeUpload(IMAGE_TYPE.ICON)}
              >
                <Button icon={<UploadOutlined />} className='ad-form-upload'>
                  Click to Upload
                </Button>
              </Upload>
            </Form.Item>
            <Collapse ghost>
              <Panel header='Advanced Settings' key='1'>
                <Form.Item name='reward-rate' label='Reward Rate' required>
                  <InputNumber min={0} max={100} className='ad-form-content' />
                </Form.Item>
                <Form.Item name='lifetime' label='lifetime' required>
                  <InputNumber min={0} max={100} className='ad-form-content' />
                </Form.Item>
                <Form.Item name='payout-base' label='Payout Base' required>
                  <InputNumber min={0} max={100} className='ad-form-content' />
                </Form.Item>
                <Form.Item name='payout-min' label='Payout Min' required>
                  <InputNumber min={0} max={100} className='ad-form-content' />
                </Form.Item>
                <Form.Item name='payout-max' label='Payout Max' required>
                  <InputNumber min={0} max={100} className='ad-form-content' />
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
