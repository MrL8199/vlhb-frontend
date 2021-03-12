import React, { ReactInstance } from 'react';
import { Table, Modal, TableProps } from 'antd';
import { DropOption } from 'components/ui';
import styles from './List.module.css';
import { Publisher } from 'types';
import { ColumnsType } from 'antd/lib/table';

const { confirm } = Modal;

interface Props extends TableProps<Publisher> {
  onDeleteItem(key: string): void;
  onEditItem(record: Publisher): void;
}

const List: React.FC<Props> = ({ onDeleteItem, onEditItem, ...tableProps }) => {
  const handleMenuClick = (record: Publisher, e: { key: React.Key; item: ReactInstance }) => {
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
      dataIndex: 'created_at',
      key: 'created_at',
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
