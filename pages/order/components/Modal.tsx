import React from 'react';
import { Form, Input, Modal, ModalProps, Radio } from 'antd';
import { Order } from 'types';

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
  item: Order;
  onOk: (...args: any[]) => any;
}

const UserModal: React.FC<Props> = ({ item = {}, onOk, ...modalProps }) => {
  const formRef = React.createRef();

  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
  };

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
          name="status"
          rules={[{ required: true }]}
          label={`Trạng thái`}
          hasFeedback
          {...formItemLayout}
        >
          <Radio.Group buttonStyle="solid">
            <Radio.Button style={radioStyle} value={1}>
              Đang xử lý
            </Radio.Button>
            <Radio.Button style={radioStyle} value={2}>
              Đóng gói
            </Radio.Button>
            <Radio.Button style={radioStyle} value={3}>
              Vận chuyển
            </Radio.Button>
            <Radio.Button style={radioStyle} value={4}>
              Đã giao
            </Radio.Button>
            <Radio.Button style={radioStyle} value={0}>
              Huỷ
            </Radio.Button>
          </Radio.Group>
        </FormItem>
      </Form>
    </Modal>
  );
};

export default UserModal;
