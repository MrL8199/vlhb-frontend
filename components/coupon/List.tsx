import React, { ReactInstance } from 'react';
import { Table, Modal, TableProps, Tooltip, Progress } from 'antd';
import { DropOption } from 'components/ui';
import styles from './List.module.css';
import { Coupon } from 'types';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import Ellipsis from 'components/ui/Ellipsis';
import { TableColumnStatusSwitch } from './TableColumnStatusSwitch/TableColumnStatusSwitch';

const { confirm } = Modal;

interface Props extends TableProps<Coupon> {
  onDeleteItem(key: string): void;
  onEditItem(record: Coupon): void;
}

const List: React.FC<Props> = ({ onDeleteItem, onEditItem, ...tableProps }) => {
  const handleMenuClick = (record: Coupon, e: { key: React.Key; item: ReactInstance }) => {
    if (e.key === '1') {
      onEditItem(record);
    } else if (e.key === '2') {
      confirm({
        title: 'Bạn có chắc xóa bản ghi này?',
        cancelText: 'Hủy',
        onOk() {
          onDeleteItem(record.id);
        },
      });
    }
  };

  const columns: ColumnsType<Coupon> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 88,
      render: (text) => {
        return '#' + text.substr(0, 4);
      },
    },
    {
      title: 'Mã',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (text) => (
        <Ellipsis tooltip length={30}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: 'Giá trị',
      dataIndex: 'value',
      key: 'value',
      render: (value) => <Progress percent={value} />,
      sorter: {
        compare: (a, b) => a.value - b.value,
        multiple: 3,
      },
    },
    {
      title: 'Giảm tối đa',
      dataIndex: 'max_value',
      key: 'max_value',
      render: (text) => <>{text.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</>,
    },
    {
      title: 'Số lượng còn',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'start_date',
      key: 'start_date',
      render: (start_date) => (
        <>
          <Tooltip title={moment(new Date(start_date * 1000)).format('HH:mm:ss DD/MM/YYYY')}>
            {moment(new Date(start_date * 1000)).fromNow()}
          </Tooltip>
        </>
      ),
      sorter: {
        compare: (a, b) => a.start_date - b.start_date,
        multiple: 3,
      },
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'end_date',
      key: 'end_date',
      render: (end_date) => (
        <>
          <Tooltip title={moment(new Date(end_date * 1000)).format('HH:mm:ss DD/MM/YYYY')}>
            {moment(new Date(end_date * 1000)).fromNow()}
          </Tooltip>
        </>
      ),
      sorter: {
        compare: (a, b) => a.end_date - b.end_date,
        multiple: 3,
      },
    },
    {
      title: 'Kích hoạt?',
      dataIndex: 'is_enable',
      key: 'is_enable',
      render(is_enable, record) {
        return <TableColumnStatusSwitch apiPath={'coupons'} id={record.id} value={is_enable} />;
      },
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (time) => (
        <>
          <Tooltip title={moment(new Date(time * 1000)).format('HH:mm:ss DD/MM/YYYY')}>
            {moment(new Date(time * 1000)).fromNow()}
          </Tooltip>
        </>
      ),
      sorter: {
        compare: (a, b) => a.created_at - b.created_at,
        multiple: 3,
      },
    },
    {
      title: 'Hành động',
      key: 'operation',
      width: 120,
      fixed: 'right',
      render: (text: any, record: any) => {
        return (
          <DropOption
            onMenuClick={(e) => handleMenuClick(record, e)}
            menuOptions={[
              { key: '1', name: 'Cập nhật' },
              { key: '2', name: 'Xóa' },
            ]}
          />
        );
      },
    },
  ];

  return (
    <Table
      {...tableProps}
      pagination={{
        ...tableProps.pagination,
        showTotal: (total) => `Tổng ${total} mục`,
      }}
      className={styles.table}
      bordered
      scroll={{ x: 1200 }}
      columns={columns}
      rowKey={(record) => record.id}
    />
  );
};

export default List;
