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
  Upload,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { AuthorsDataOption, Product } from 'types';
import { CategoryService } from 'services';
import { PublisherService } from 'services/publisherService';
import { AuthorService } from 'services/authorService';
import { parseCookies } from 'nookies';
import { API_URL } from 'utils/constants';

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
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<AuthorsDataOption[]>([]);
  const [publishers, setPublishers] = useState<AuthorsDataOption[]>([]);
  const [authors, setAuthors] = useState<AuthorsDataOption[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [fileList, setFileList] = useState<any>([]);
  const [listID, setListID] = useState<any>([]);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

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

  const formRef = React.useRef<FormInstance>(null);

  const handleOk = () => {
    formRef.current
      ?.validateFields()
      .then((values) => {
        const data = {
          ...values,
          images: listID,
        };
        onOk(data);
      })
      .catch((errorInfo: any) => {
        console.log(errorInfo);
      });
  };

  const handleCancel = () => setPreviewVisible(false);

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
        scrollToFirstError
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
      </Form>
    </Modal>
  );
};

export default UserModal;
