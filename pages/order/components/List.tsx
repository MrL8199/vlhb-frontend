import React from 'react';
import { Table, Modal, Avatar, TableProps, Tag, Tooltip } from 'antd';
import { DropOption } from 'components/ui';
import Link from 'next/link';
import styles from './List.module.css';
import { Order } from 'types';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import {
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

const { confirm } = Modal;

interface Props extends TableProps<Order> {
  onDeleteItem(key: string): void;
  onEditItem(record: Order): void;
}

const List: React.FC<Props> = ({ onDeleteItem, onEditItem, ...tableProps }) => {
  const handleMenuClick = (record: Order, e: { key: string; name: string }) => {
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

  const columns: ColumnsType<Order> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 88,
      render: (text, record) => <Link href={`order/${record.id}`}>{'#' + text.substr(0, 4)}</Link>,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'address',
      key: 'address',
      render: (address, record) => <Link href={`user/${record.user_id}`}>{address.name}</Link>,
    },
    {
      title: 'Khu vực',
      dataIndex: 'address',
      key: 'address',
      render: (address) => <>{address.state}</>,
      sorter: {
        compare: (a, b) => ('' + a.address.state).localeCompare(b.address.state),
        multiple: 1,
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = {
          '4': ['success', <CheckCircleOutlined key="4" />, 'Nhận hàng'],
          '2': ['processing', <SyncOutlined spin key="2" />, 'Đóng gói'],
          '0': ['error', <CloseCircleOutlined key="0" />, 'Đã huỷ'],
          '1': ['warning', <ClockCircleOutlined key="1" />, 'Đang xử lý'],
          '3': ['processing', <SyncOutlined spin key="3" />, 'Đang vận chuyển'],
          default: ['other'],
        };
        const color = colors[status];
        return (
          <Tag icon={color[1]} color={color[0]} key={status}>
            {color[2]}
          </Tag>
        );
      },
      sorter: {
        compare: (a, b) => a.status - b.status,
        multiple: 1,
      },
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'grand_total',
      key: 'grand_total',
      render: (text) => <>{text.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</>,
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'created_at',
      key: 'created_at',
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
      simple
      rowKey={(record) => record.id}
    />
  );
};

export default List;
