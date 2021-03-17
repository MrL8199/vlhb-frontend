import React, { useEffect, useState } from 'react';
import {
  Select,
  Form,
  FormInstance,
  Input,
  InputNumber,
  message,
  Modal,
  ModalProps,
  Progress,
  Upload,
} from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';
import { AuthorsDataOption, Product } from 'types';
import { CategoryService } from 'services';
import { PublisherService } from 'services/publisherService';
import { AuthorService } from 'services/authorService';

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
  item: Product | undefined;
  onOk: (...args: any[]) => any;
}

const UserModal: React.FC<Props> = ({ item = {}, onOk, ...modalProps }) => {
  const [loading, setLoading] = useState(false);
  const [imgURL, setImgURL] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [categories, setCategories] = useState<AuthorsDataOption[]>([]);
  const [publishers, setPublishers] = useState<AuthorsDataOption[]>([]);
  const [authors, setAuthors] = useState<AuthorsDataOption[]>([]);

  const onChangeCategory = (value: string) => {
    formRef.current?.setFieldsValue({ category_id: value });
  };

  const onChangeAuthor = (value: string) => {
    formRef.current?.setFieldsValue({ author_id: value });
  };

  const onChangePublisher = (value: string) => {
    formRef.current?.setFieldsValue({ publisher_id: value });
  };

  useEffect(() => {
    if (item) setImgURL(item.picture);
    else setImgURL('');

    const fetchData = async () => {
      try {
        setLoading(true);
        const categories = await CategoryService.getCategoriesOption();
        setCategories(categories);
        const publishers = await PublisherService.getPublishersOption();
        setPublishers(publishers);
        const authors = await AuthorService.getAuthorsOption();
        setAuthors(authors);
      } catch (error) {
        message.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
    const { onSuccess, onError, file } = option;

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
      <Form
        ref={formRef}
        name="control-ref"
        initialValues={{
          ...item,
          author_id: item.author?.id,
          category_id: item.category?.id,
          publisher_id: item.publisher?.id,
        }}
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
          name="title"
          rules={[{ required: true }]}
          label={`Tên sản phẩm`}
          hasFeedback
          {...formItemLayout}
        >
          <Input />
        </FormItem>
        <FormItem
          name="price"
          rules={[{ required: true }]}
          label={`Giá bán`}
          hasFeedback
          {...formItemLayout}
        >
          <InputNumber min={1} />
        </FormItem>
        <FormItem
          name="buy_price"
          rules={[{ required: true }]}
          label={`Giá nhập vào`}
          hasFeedback
          {...formItemLayout}
        >
          <InputNumber min={1} />
        </FormItem>
        <FormItem
          name="publish_year"
          rules={[{ required: true }]}
          label={`Năm xuất bản`}
          hasFeedback
          {...formItemLayout}
        >
          <InputNumber min={1} />
        </FormItem>
        <FormItem
          name="quantity"
          rules={[{ required: true }]}
          label={`Số lượng nhập`}
          hasFeedback
          {...formItemLayout}
        >
          <InputNumber min={1} />
        </FormItem>
        <FormItem
          name="quotes_about"
          rules={[{ required: true }]}
          label={`Trích dẫn`}
          hasFeedback
          {...formItemLayout}
        >
          <Input.TextArea size={'small'} />
        </FormItem>
        <FormItem
          name="discount"
          rules={[{ required: true }]}
          label={`Giảm giá`}
          hasFeedback
          {...formItemLayout}
        >
          <InputNumber min={1} />
        </FormItem>
        <FormItem
          name="page_number"
          rules={[{ required: true }]}
          label={`Số trang`}
          hasFeedback
          {...formItemLayout}
        >
          <InputNumber min={1} />
        </FormItem>
        <FormItem
          name={['author', 'id']}
          rules={[{ required: true }]}
          label={`Tác giả`}
          hasFeedback
          {...formItemLayout}
        >
          <Select options={authors} onChange={onChangeAuthor} placeholder="Chọn tác giả" />
        </FormItem>
        <FormItem
          name={['publisher', 'id']}
          rules={[{ required: true }]}
          label={`Nhà xuất bản`}
          hasFeedback
          {...formItemLayout}
        >
          <Select
            options={publishers}
            onChange={onChangePublisher}
            placeholder="Chọn nhà xuất bản"
          />
        </FormItem>
        <FormItem
          style={{ display: 'none' }}
          name={'category_id'}
          label={`Thể loại`}
          hasFeedback
          {...formItemLayout}
        >
          <Input defaultValue={item.category?.id} />
        </FormItem>
        <FormItem
          style={{ display: 'none' }}
          name={'author_id'}
          label={`Tac gia`}
          hasFeedback
          {...formItemLayout}
        >
          <Input defaultValue={item.author?.id} />
        </FormItem>
        <FormItem
          style={{ display: 'none' }}
          name={'publisher_id'}
          label={`NXB`}
          hasFeedback
          {...formItemLayout}
        >
          <Input defaultValue={item.publisher?.id} />
        </FormItem>
        <FormItem
          name={['category', 'id']}
          rules={[{ required: true }]}
          label={`Thể loại`}
          hasFeedback
          {...formItemLayout}
        >
          <Select options={categories} onChange={onChangeCategory} placeholder="Chọn thể loại" />
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
