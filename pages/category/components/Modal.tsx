import React from 'react';
import { Form, Input, Modal, ModalProps } from 'antd';
import { Category } from 'types';

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
  item: Category;
  onOk: (...args: any[]) => any;
}

const UserModal: React.FC<Props> = ({ item = {}, onOk, ...modalProps }) => {
  const formRef = React.createRef();

  console.log(modalProps.type);

  const handleOk = () => {
    formRef.current
      .validateFields()
      .then((values) => {
        const data = {
          ...values,
          key: item.key,
        };
        onOk(data);
      })
      .catch((errorInfo) => {
        console.log(errorInfo);
      });
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
          label={`Tên Thể loại`}
          hasFeedback
          {...formItemLayout}
        >
          <Input />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default UserModal;
