import React from 'react';
import { Page } from 'components/ui';
import { Button, Card, Divider, Image, Space, Table, Tag } from 'antd';
import { Descriptions, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { IOrderProduct, Order } from 'types';
import { GetServerSideProps } from 'next';
import { OrderService } from 'services/orderService';
import { useRouter } from 'next/router';
import moment from 'moment';
import { ColumnsType } from 'antd/lib/table';
import Link from 'next/link';
import {
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

interface Props {
  order: Order;
  error?: string;
}

const UserDetail: React.FC<Props> = ({ order, error }) => {
  const router = useRouter();

  const colors: any = {
    '4': ['success', <CheckCircleOutlined key="4" />, 'Nhận hàng'],
    '2': ['processing', <SyncOutlined spin key="2" />, 'Đóng gói'],
    '0': ['error', <CloseCircleOutlined key="0" />, 'Đã huỷ'],
    '1': ['warning', <ClockCircleOutlined key="1" />, 'Đang xử lý'],
    '3': ['processing', <SyncOutlined spin key="3" />, 'Đang vận chuyển'],
    default: ['other'],
  };
  const color = colors[order.status];

  const columns: ColumnsType<IOrderProduct> = [
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
      render: (title, record) => (
        <Link href={`/product/${record.product.id}`}>{record.product.title}</Link>
      ),
    },
    {
      title: 'Ảnh bìa',
      dataIndex: 'images',
      key: 'images',
      render: (images, record) => <Image src={record.product.images[0]?.url}></Image>,
    },
    {
      title: 'Số lượng đặt',
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
      title: 'Tổng',
      dataIndex: 'total',
      key: 'total',
      render: (total, record) => (
        <>
          {(record.quantity * (record.price - record.discount)).toLocaleString('it-IT', {
            style: 'currency',
            currency: 'VND',
          })}
        </>
      ),
    },
  ];

  return (
    <Page inner loading={false} className={'main'}>
      {error != null && message.error(error)}
      <Space direction="vertical">
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
          Quay lại
        </Button>
        <Card bordered={false}>
          <Descriptions title="Đơn hàng" style={{ marginBottom: 32 }}>
            <Descriptions.Item label="Mã đơn">{'#' + order.id.substr(0, 16)}</Descriptions.Item>
            <Descriptions.Item label="Ghi chú">
              {order.content ? order.content : 'Không có ghi chú'}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag icon={color[1]} color={color[0]} key={status}>
                {color[2]}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày đặt">
              {moment(new Date(order.created_at * 1000)).format('HH:mm:SS - DD/MM/YYYY')}
            </Descriptions.Item>
            <Descriptions.Item label="Tổng">
              {order.grand_total.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
            </Descriptions.Item>
          </Descriptions>
          <Divider style={{ marginBottom: 32 }} />
          <Descriptions title="Khách hàng" style={{ marginBottom: 32 }}>
            <Descriptions.Item label="Tên">{order.address.name}</Descriptions.Item>
            <Descriptions.Item label="SĐT">{order.address.phone}</Descriptions.Item>
            <Descriptions.Item label="Email">{order.address.email}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">{order.address.address}</Descriptions.Item>
            <Descriptions.Item label="Phường/Xã">{order.address.district}</Descriptions.Item>
            <Descriptions.Item label="Quận/Huyện">{order.address.city}</Descriptions.Item>
            <Descriptions.Item label="Tỉnh/Thành phố">{order.address.state}</Descriptions.Item>
          </Descriptions>
          <Divider style={{ marginBottom: 32 }} />
          <div>Chi tiết</div>
          <Table
            style={{ marginBottom: 24 }}
            pagination={false}
            dataSource={order.items}
            columns={columns}
            rowKey="id"
          />
        </Card>
        {/* 

          
          <Descriptions.Item label="Giảm giá">{order.discount}</Descriptions.Item>
          <Descriptions.Item label="Tổng cộng">{order.subtotal}</Descriptions.Item>
          <Descriptions.Item label="Thuế">{order.tax}</Descriptions.Item>
          <Descriptions.Item label="Tổng (tạm tính)">{order.total}</Descriptions.Item>
              <Descriptions.Item label="Tổng giảm giá sản phẩm">
                {order.item_discount}
              </Descriptions.Item>
              <Descriptions.Item label="Mã giảm giá">{order.promo}</Descriptions.Item>
              <Descriptions.Item label="Phí ship">{order.shipping}</Descriptions.Item>
            </Descriptions>
          </DescriptionsItem>
        </Descriptions> */}
      </Space>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.query.id as string;

  try {
    const { order } = await OrderService.fetchOrder(id);
    return {
      props: { order },
    };
  } catch (error) {
    return {
      props: {
        order: null,
        error: error.message,
      },
    };
  }
};

export default UserDetail;
