import React, { ReactInstance } from 'react';
import { Table, Modal, TableProps, Tooltip, Image } from 'antd';
import { DropOption } from 'components/ui';
import styles from './List.module.css';
import { User } from 'types';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import Ellipsis from 'components/ui/Ellipsis';
import { TableColumnStatusSwitch } from './TableColumnStatusSwitch/TableColumnStatusSwitch';
import Link from 'next/link';

const { confirm } = Modal;

interface Props extends TableProps<User> {
  onDeleteItem(key: string): void;
  onEditItem(record: User): void;
}

const List: React.FC<Props> = ({ onDeleteItem, onEditItem, ...tableProps }) => {
  const handleMenuClick = (record: User, e: { key: React.Key; item: ReactInstance }) => {
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

  const columns: ColumnsType<User> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 88,
      render: (text, record) => <Link href={`user/${record.id}`}>{'#' + text.substr(0, 4)}</Link>,
    },
    {
      title: 'Tên tài khoản',
      dataIndex: 'user_name',
      key: 'user_name',
      render: (text, record) => <Link href={`user/${record.id}`}>{text}</Link>,
    },
    {
      title: 'Tên',
      dataIndex: 'nickname',
      key: 'nickname',
    },
    {
      title: 'Ảnh bìa',
      dataIndex: 'images',
      key: 'images',
      align: 'center',
      render: (text, record) => <Image style={{ width: '50px' }} src={record.avatar_url}></Image>,
    },
    {
      title: 'email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => (
        <Ellipsis tooltip length={30}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: 'phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (text) => (
        <Ellipsis tooltip length={30}>
          {text}
        </Ellipsis>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (created_at) => (
        <>
          <Tooltip title={moment(new Date(created_at * 1000)).format('HH:mm:ss DD/MM/YYYY')}>
            {moment(new Date(created_at * 1000)).fromNow()}
          </Tooltip>
        </>
      ),
      sorter: {
        compare: (a, b) => a.created_at - b.created_at,
        multiple: 3,
      },
    },
    {
      title: 'Ngày cập nhập',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (updated_at) => (
        <>
          <Tooltip title={moment(new Date(updated_at * 1000)).format('HH:mm:ss DD/MM/YYYY')}>
            {moment(new Date(updated_at * 1000)).fromNow()}
          </Tooltip>
        </>
      ),
      sorter: {
        compare: (a, b) => a.updated_at - b.updated_at,
        multiple: 3,
      },
    },
    {
      title: 'Quản trị?',
      dataIndex: 'is_admin',
      key: 'is_admin',
      align: 'center',
      render(is_admin, record) {
        return <TableColumnStatusSwitch apiPath={'user'} id={record.id} value={is_admin} />;
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
        showTotal: (total) => `Tổng ${total} người dùng`,
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
