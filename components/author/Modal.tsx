import React, { useEffect, useState } from 'react';
import { Form, FormInstance, Input, message, Modal, ModalProps, Progress, Upload } from 'antd';
import { Author } from 'types';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';

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

const UserModal: React.FC<Props> = ({ item, onOk, ...modalProps }) => {
  const [loading, setLoading] = useState(false);
  const [imgURL, setImgURL] = useState<string>('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (item) setImgURL(item.picture);
    else setImgURL('');
  }, [item]);

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
      setLoading(false);
    }
  };

  const formRef = React.useRef<FormInstance>(null);

  const handleOk = () => {
    formRef.current
      ?.validateFields()
      .then((values) => {
        const data = {
          ...values,
          key: item?.id,
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

  // *********** Upload file to Cloudinary ******************** //
  const uploadFile = async (option: RcCustomRequestOptions) => {
    const { onSuccess, onError, file, onProgress } = option;

    const cloudName = 'demo';
    const unsignedUploadPreset = 'doc_codepen_example';
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    const xhr = new XMLHttpRequest();
    const fd = new FormData();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    // Update progress (can be used to show progress indicator)
    xhr.upload.addEventListener('progress', function (e) {
      const percent = Math.floor((e.loaded / e.total) * 100);
      setProgress(percent);
      if (percent === 100) {
        setTimeout(() => setProgress(0), 1000);
      }
    });

    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        // File uploaded successfully
        const response = JSON.parse(xhr.responseText);
        // https://res.cloudinary.com/cloudName/image/upload/v1483481128/public_id.jpg
        const url = response.secure_url;
        // Create a thumbnail of the uploaded image, with 150px width
        const tokens = url.split('/');
        tokens.splice(-2, 0, 'w_150,c_scale');
        const img = new Image(); // HTML5 Constructor
        img.src = tokens.join('/');
        img.alt = response.public_id;

        formRef.current?.setFieldsValue({ picture: img.src });
        if (item) item.picture = img.src;
        setImgURL(img.src);
        if (onSuccess) onSuccess(response.body, xhr);
      }
    };

    xhr.onerror = () => {
      const error = new Error(
        xhr.statusText + ' - ' + xhr.status + 'Failed to upload file to cloud storage'
      );
      if (onError) onError(error, {});
    };

    fd.append('upload_preset', unsignedUploadPreset);
    fd.append('tags', 'browser_upload'); // Optional - add tag for image admin in Cloudinary
    fd.append('file', file);
    xhr.send(fd);
  };

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
        <FormItem
          name="info"
          rules={[{ required: true }]}
          label={`Thông tin`}
          hasFeedback
          {...formItemLayout}
        >
          <Input.TextArea size={'small'} />
        </FormItem>
        <FormItem
          style={{ display: 'none' }}
          name="picture"
          label={`Hình ảnh`}
          hasFeedback
          {...formItemLayout}
        >
          <Input />
        </FormItem>
        <FormItem label={`Hình ảnh`} {...formItemLayout}>
          <Upload
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={beforeUpload}
            onChange={handleChange}
            customRequest={uploadFile}
          >
            {imgURL !== '' ? (
              <img src={imgURL} alt="avatar" style={{ width: '100%' }} />
            ) : (
              uploadButton
            )}
          </Upload>
          {progress > 0 ? <Progress percent={progress} /> : null}
        </FormItem>
      </Form>
    </Modal>
  );
};

export default UserModal;
