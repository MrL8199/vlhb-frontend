import React, { useState } from 'react';
import { Form, FormInstance, Input, message, Modal, ModalProps, Upload } from 'antd';
import { Author } from 'types';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

interface Props extends ModalProps {
  type: string;
  item: Author | undefined;
  onOk: (...args: any[]) => any;
}

const UserModal: React.FC<Props> = ({ item = {}, onOk, ...modalProps }) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const getBase64 = (img: any, callback: any) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Bạn chỉ có thể tải lên tệp JPG/PNG !');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Ảnh phải có kích thước nhỏ hơn 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl: string) => {
        setLoading(false);
        setImageUrl(imageUrl);
      });
    }
  };

  const formRef = React.useRef<FormInstance>(null);

  const handleOk = () => {
    formRef.current
      ?.validateFields()
      .then((values) => {
        const data = {
          ...values,
          key: item.id,
        };
        onOk(data);
      })
      .catch((errorInfo: any) => {
        console.log(errorInfo);
      });
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Modal {...modalProps} onOk={handleOk} cancelText={'Hủy'}>
      <Form ref={formRef} name="control-ref" initialValues={{ ...item }} layout="horizontal">
        {modalProps.type === 'update' && (
          <FormItem
            name="id"
            rules={[{ required: true }]}
            label={`ID`}
            hasFeedback
            {...formItemLayout}
          >
            <Input disabled={true} />
          </FormItem>
        )}
        <FormItem
          name="name"
          rules={[{ required: true }]}
          label={`Tên tác giả`}
          hasFeedback
          {...formItemLayout}
        >
          <Input />
        </FormItem>
        <FormItem name="info" label={`Thông tin`} hasFeedback {...formItemLayout}>
          <Input.TextArea size={'small'} />
        </FormItem>
        <FormItem name="picture" label={`Hình ảnh`} hasFeedback {...formItemLayout}>
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="https://leaa-api.qcolate.com/v1/attachments/upload"
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
            ) : (
              uploadButton
            )}
          </Upload>
        </FormItem>
      </Form>
    </Modal>
  );
};

export default UserModal;
