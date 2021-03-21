import React, { useState } from 'react';
import {
  Form,
  FormInstance,
  Input,
  Modal,
  ModalProps,
  message,
  Upload,
  Switch,
  InputNumber,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { User } from 'types';
import moment from 'moment';

import { API_URL } from 'utils/constants';
import { parseCookies } from 'nookies';

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
  item: User | undefined;
  onOk: (...args: any[]) => any;
}

function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

function getToken() {
  const { token } = parseCookies({});
  return token;
}

const UserModal: React.FC<Props> = ({ item = {}, onOk, ...modalProps }) => {
  const formRef = React.useRef<FormInstance>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [fileList, setFileList] = useState<any>([]);
  const [listID, setListID] = useState<any>([]);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  const handleChange = (obj: any) => {
    let { file } = obj;
    if (file.status === 'done') {
      setListID([file.response?.data.id, ...listID]);
      file = { id: file.response.data.id, ...file };
    }
    if (file.status === 'removed') {
      if (file.response?.data.id != null)
        setListID(listID.filter((item: any) => item != file.response.data.id));
    }
    const { fileList } = obj;
    setFileList(fileList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </div>
  );

  const handleOk = () => {
    formRef.current
      ?.validateFields()
      .then((values) => {
        const fields = handleFields(values);
        const data = {
          ...fields,
        };
        onOk(data);
      })
      .catch((errorInfo) => {
        console.log(errorInfo);
      });
  };

  const handleFields = (fields: any) => {
    const { createTime } = fields;
    if (createTime && createTime.length) {
      fields.created_at = moment(createTime[0]).unix();
      fields.updated_at = moment(createTime[1]).unix();
    }
    return fields;
  };

  const initialCreateTime = [];
  if (item.created_at) {
    initialCreateTime[0] = moment(item.created_at * 1000);
  }
  if (item.updated_at) {
    initialCreateTime[1] = moment(item.updated_at * 1000);
  }

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

  const handleCancel = () => setPreviewVisible(false);

  return (
    <Modal {...modalProps} onOk={handleOk} cancelText={'Hủy'}>
      <Form
        ref={formRef}
        name="control-ref"
        initialValues={{ ...item, createTime: initialCreateTime }}
        layout="horizontal"
      >
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
          name="user_name"
          rules={[{ required: true, message: 'Hãy nhập tên đăng nhập!' }]}
          label={`Tên đăng nhập`}
          hasFeedback
          {...formItemLayout}
        >
          <Input disabled={modalProps.type === 'update' ? true : false} />
        </FormItem>
        {modalProps.type === 'create' && (
          <>
            <FormItem
              name="password"
              label="Mật khẩu"
              rules={[
                {
                  required: true,
                  message: 'Hãy nhập mật khẩu!',
                },
              ]}
              hasFeedback
              {...formItemLayout}
            >
              <Input.Password />
            </FormItem>

            <FormItem
              name="confirm"
              label="Xác nhận mật khẩu"
              dependencies={['password']}
              hasFeedback
              {...formItemLayout}
              rules={[
                {
                  required: true,
                  message: 'Hãy nhập lại mật khẩu bạn vừa nhập!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu không trùng khớp!'));
                  },
                }),
              ]}
            >
              <Input.Password />
            </FormItem>
          </>
        )}
        <FormItem
          name="nickname"
          rules={[{ required: true, message: 'Hãy nhập tên của bạn!' }]}
          label={`Tên`}
          hasFeedback
          {...formItemLayout}
        >
          <Input />
        </FormItem>
        <FormItem label={`Hình ảnh`} {...formItemLayout}>
          <Upload
            accept="image/*"
            action={`${API_URL}/upload/`}
            headers={{
              Authorization: `Bearer ${getToken()}`,
            }}
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            beforeUpload={beforeUpload}
          >
            {fileList.length >= 8 ? null : uploadButton}
          </Upload>
          <Modal
            visible={previewVisible}
            title={previewTitle}
            footer={null}
            onCancel={handleCancel}
          >
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </FormItem>
        <FormItem
          name="email"
          rules={[{ required: true, message: 'Hãy nhập email!' }]}
          label={`Email`}
          hasFeedback
          {...formItemLayout}
        >
          <Input />
        </FormItem>
        <FormItem
          name="phone"
          rules={[{ required: true, message: 'Hãy nhập số điện thoại!' }]}
          label={`Số điện thoại`}
          hasFeedback
          {...formItemLayout}
        >
          <InputNumber maxLength={15} style={{ width: 200 }} />
        </FormItem>
        <FormItem
          name="is_admin"
          rules={[{ required: true, message: 'Hãy chọn chức vụ!' }]}
          label={`Quản trị`}
          hasFeedback
          {...formItemLayout}
        >
          {modalProps.type === 'update' ? <Switch defaultChecked={item.is_admin} /> : <Switch />}
        </FormItem>
      </Form>
    </Modal>
  );
};

export default UserModal;
