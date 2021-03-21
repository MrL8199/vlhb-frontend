import React from 'react';
import moment from 'moment';
import { FilterItem } from 'components/ui';
import { Button, Row, Col, DatePicker, Form, FormInstance } from 'antd';

interface Props {
  filter: any;
  onFilterChange: (fields: any) => void;
}

const { RangePicker } = DatePicker;

const ColProps = {
  xs: 24,
  sm: 12,
  style: {
    marginBottom: 16,
  },
};

const TwoColProps = {
  ...ColProps,
  xl: 96,
};

const Filter: React.FC<Props> = ({ onFilterChange, filter }) => {
  const formRef = React.useRef<FormInstance>(null);

  const handleFields = (fields: any) => {
    const { createTime } = fields;
    if (createTime && createTime.length) {
      fields.from_date = moment(createTime[0]).unix();
      fields.to_date = moment(createTime[1]).unix();
      delete fields.createTime;
    } else {
      fields.from_date = undefined;
      fields.to_date = undefined;
    }
    return fields;
  };

  const handleSubmit = () => {
    const values = formRef.current?.getFieldsValue();
    const fields = handleFields(values);
    onFilterChange(fields);
  };

  const handleReset = () => {
    const fields = formRef.current?.getFieldsValue();
    for (let item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (fields[item] instanceof Array) {
          fields[item] = [];
        } else {
          fields[item] = undefined;
        }
      }
    }
    formRef.current?.setFieldsValue(fields);
    handleSubmit();
  };

  const initialCreateTime = [];
  if (filter.createTime && filter.createTime[0]) {
    initialCreateTime[0] = moment(filter.createTime[0]);
  }
  if (filter.createTime && filter.createTime[1]) {
    initialCreateTime[1] = moment(filter.createTime[1]);
  }

  return (
    <>
      <Form ref={formRef} name="control-ref" initialValues={{ createTime: initialCreateTime }}>
        <Row gutter={24}>
          <Col
            {...ColProps}
            xl={{ span: 10 }}
            md={{ span: 12 }}
            sm={{ span: 16 }}
            id="createTimeRangePicker"
          >
            <FilterItem label={`Ngày`}>
              <Form.Item name="createTime">
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </FilterItem>
          </Col>
          <Col {...TwoColProps} xl={{ span: 10 }} md={{ span: 24 }} sm={{ span: 24 }}>
            <Row align="middle" justify="space-between">
              <div>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="margin-right"
                  onClick={handleSubmit}
                >
                  Tìm kiếm
                </Button>
                <Button onClick={handleReset}>Đặt lại</Button>
              </div>
            </Row>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default Filter;
