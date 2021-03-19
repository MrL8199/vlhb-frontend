import React from 'react';
import { DatePicker, Form, FormInstance, Input, InputNumber, Modal, ModalProps } from 'antd';
import { Coupon } from 'types';
import moment from 'moment';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

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
  item: Coupon | undefined;
  onOk: (...args: any[]) => any;
}

const UserModal: React.FC<Props> = ({ item = {}, onOk, ...modalProps }) => {
  const formRef = React.useRef<FormInstance>(null);

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
      fields.start_date = moment(createTime[0]).unix();
      fields.end_date = moment(createTime[1]).unix();
    }
    return fields;
  };

  const initialCreateTime = [];
  if (item.start_date) {
    initialCreateTime[0] = moment(item.start_date * 1000);
  }
  if (item.end_date) {
    initialCreateTime[1] = moment(item.end_date * 1000);
  }

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
          name="code"
          rules={[{ required: true }]}
          label={`Mã`}
          hasFeedback
          {...formItemLayout}
        >
          <Input />
        </FormItem>
        <FormItem name="description" label={`Mô tả`} hasFeedback {...formItemLayout}>
          <Input.TextArea size={'small'} />
        </FormItem>
        <FormItem
          name="value"
          rules={[{ required: true }]}
          label={`Giá trị`}
          hasFeedback
          {...formItemLayout}
        >
          <InputNumber min={1} max={100} />
        </FormItem>
        <FormItem
          name="max_value"
          rules={[{ required: true }]}
          label={`Giảm tối đa`}
          hasFeedback
          {...formItemLayout}
        >
          <InputNumber min={1} />
        </FormItem>
        <FormItem
          name="amount"
          rules={[{ required: true }]}
          label={`Số lượng`}
          hasFeedback
          {...formItemLayout}
        >
          <InputNumber min={1} />
        </FormItem>
        <FormItem
          name="createTime"
          rules={[{ required: true }]}
          label={`Thời hạn`}
          hasFeedback
          {...formItemLayout}
        >
          <RangePicker style={{ width: '100%' }} />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default UserModal;
