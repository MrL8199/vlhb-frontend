import React from 'react';
import { Page } from 'components/ui';
import { Button, Space } from 'antd';
import { Descriptions, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Order } from 'types';
import { GetServerSideProps } from 'next';
import { OrderService } from 'services/orderService';
import DescriptionsItem from 'antd/lib/descriptions/Item';
import { useRouter } from 'next/router';

interface Props {
  order: Order;
  error?: string;
}

const UserDetail: React.FC<Props> = ({ order, error }) => {
  const router = useRouter();

  return (
    <Page inner>
      {error != null && message.error(error)}
      <Space direction="vertical">
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
          Quay lại
        </Button>
        <Descriptions title="Thông tin đơn hàng" layout="vertical">
          <Descriptions.Item label="Khách hàng">
            <Descriptions layout="horizontal">
              <Descriptions.Item>{order.address.name}</Descriptions.Item>
              <Descriptions.Item>{order.address.district}</Descriptions.Item>
              <Descriptions.Item>{order.address.city}</Descriptions.Item>
              <Descriptions.Item>{order.address.state}</Descriptions.Item>
              <Descriptions.Item>{order.address.name}</Descriptions.Item>
              <Descriptions.Item>{order.address.city}</Descriptions.Item>
              <Descriptions.Item>{order.address.name}</Descriptions.Item>
              <Descriptions.Item>{order.address.city}</Descriptions.Item>
            </Descriptions>
          </Descriptions.Item>

          <Descriptions.Item label="Ghi chú">{order.content}</Descriptions.Item>
          <Descriptions.Item label="Ngày đặt">{order.created_at}</Descriptions.Item>
          <Descriptions.Item label="Giảm giá">{order.discount}</Descriptions.Item>
          <Descriptions.Item label="Tổng cộng">{order.subtotal}</Descriptions.Item>
          <Descriptions.Item label="Thuế">{order.tax}</Descriptions.Item>
          <Descriptions.Item label="Tổng (tạm tính)">{order.total}</Descriptions.Item>
          <Descriptions.Item label="ID người dùng">{order.user_id}</Descriptions.Item>
          <Descriptions.Item label="Address">
            No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
          </Descriptions.Item>
          <DescriptionsItem>
            <Descriptions bordered layout="horizontal">
              <Descriptions.Item label="Tổng cộng phải trả">{order.grand_total}</Descriptions.Item>
              <Descriptions.Item label="ID đơn hàng">{order.id}</Descriptions.Item>
              <Descriptions.Item label="Tổng giảm giá sản phẩm">
                {order.item_discount}
              </Descriptions.Item>
              <Descriptions.Item label="Danh sách sản phẩm">{order.user_id}</Descriptions.Item>
              <Descriptions.Item label="Mã giảm giá">{order.promo}</Descriptions.Item>
              <Descriptions.Item label="Phí ship">{order.shipping}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái đơn hàng">{order.status}</Descriptions.Item>
            </Descriptions>
          </DescriptionsItem>
        </Descriptions>
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
