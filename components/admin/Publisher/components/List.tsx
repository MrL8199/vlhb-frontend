import React from 'react';
import { Table, Modal, Avatar, TableProps } from 'antd';
import { DropOption } from 'components/ui';
import Link from 'next/link';
import styles from './List.module.css';
import { Publisher } from 'types';
import { ColumnsType } from 'antd/lib/table';

const { confirm } = Modal;

interface Props extends TableProps<Publisher> {
  onDeleteItem(key: string): void;
  onEditItem(record: Publisher): void;
}

const List: React.FC<Props> = ({ onDeleteItem, onEditItem, ...tableProps }) => {
  const handleMenuClick = (record: Publisher, e: { key: string; name: string }) => {
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

  const columns: ColumnsType<Publisher> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên NXB',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'create_time',
      key: 'create_time',
      // sorter: {
      //   compare: (a, b) => a.create_time - b.create_time,
      //   multiple: 3,
      // },
    },
    {
      title: 'Hoạt động',
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
