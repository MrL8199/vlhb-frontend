import React, { ReactInstance } from 'react';
import { Table, Modal, TableProps, Tooltip, Image } from 'antd';
import { DropOption } from 'components/ui';
import Link from 'next/link';
import styles from './List.module.css';
import { Product } from 'types';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';

const { confirm } = Modal;

interface Props extends TableProps<Product> {
  onDeleteItem(key: string): void;
  onEditItem(record: Product): void;
}

const List: React.FC<Props> = ({ onDeleteItem, onEditItem, ...tableProps }) => {
  const handleMenuClick = (record: Product, e: { key: React.Key; item: ReactInstance }) => {
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

  const columns: ColumnsType<Product> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 88,
      render: (text, record) => (
        <Link href={`product/${record.id}`}>{'#' + text.substr(0, 4)}</Link>
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'title',
      key: 'title',
      render: (title, record) => <Link href={`product/${record.id}`}>{title}</Link>,
      sorter: {
        compare: (a, b) => ('' + a.title).localeCompare(b.title),
        multiple: 1,
      },
    },
    {
      title: 'Ảnh bìa',
      dataIndex: 'images',
      key: 'images',
      render: (images) => <Image src={images[0]}></Image>,
    },
    {
      title: 'Số lượng còn',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: {
        compare: (a, b) => a.quantity - b.quantity,
        multiple: 1,
      },
    },
    {
      title: 'Giá tiền',
      dataIndex: 'price',
      key: 'price',
      render: (text) => <>{text.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</>,
    },
    {
      title: 'Giảm giá',
      dataIndex: 'discount',
      key: 'discount',
      render: (text) => <>{text.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</>,
    },
    {
      title: 'Thể loại',
      dataIndex: 'category',
      key: 'category',
      render: (category) => category.name,
    },
    {
      title: 'Ngày cập nhật',
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
        showSizeChanger: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} trên tổng ${total} mục`,
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
