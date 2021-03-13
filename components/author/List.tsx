import React, { ReactInstance } from 'react';
import { Table, Modal, TableProps, Image, Tooltip } from 'antd';
import { DropOption } from 'components/ui';
import styles from './List.module.css';
import { Author } from 'types';
import { ColumnsType } from 'antd/lib/table';
import Ellipsis from 'components/ui/Ellipsis';
import Link from 'next/link';
import moment from 'moment';

const { confirm } = Modal;

interface Props extends TableProps<Author> {
  onDeleteItem(key: string): void;
  onEditItem(record: Author): void;
}

const List: React.FC<Props> = ({ onDeleteItem, onEditItem, ...tableProps }) => {
  const handleMenuClick = (record: Author, e: { key: React.Key; item: ReactInstance }) => {
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

  const columns: ColumnsType<Author> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 88,
      render: (text, record) => <Link href={`author/${record.id}`}>{'#' + text.substr(0, 4)}</Link>,
    },
    {
      title: 'Tên tác giả',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'picture',
      key: 'picture',
      render: (text) => (
        <Image
          width={160}
          height={200}
          src={text}
          fallback={'/images/default_img.png'}
          placeholder={
            <Image preview={false} src={'/images/default_img.png'} width={160} height={200} />
          }
        />
      ),
    },
    {
      title: 'Thông tin',
      dataIndex: 'info',
      key: 'info',
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
