import React, { useEffect, useState } from 'react';
import { Page } from 'components/ui';
import { Order } from 'types';
import { OrderService } from 'services/orderService';
import { useRouter } from 'next/router';
import { Descriptions, message } from 'antd';

const UserDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [orderDetail, setOrderDetail] = useState<Order>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const results = await OrderService.fetchOrder(id);
        setOrderDetail(results);
      } catch (error) {
        message.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  return (
    <Page inner loading={loading}>
      <Descriptions title="Thông tin đơn hàng">
        <Descriptions.Item label="address">{orderDetail.address}</Descriptions.Item>
        <Descriptions.Item label="content">{orderDetail.content}</Descriptions.Item>
        <Descriptions.Item label="created_at">{orderDetail.created_at}</Descriptions.Item>
        <Descriptions.Item label="discount">{orderDetail.discount}</Descriptions.Item>
        <Descriptions.Item label="grand_total">{orderDetail.grand_total}</Descriptions.Item>
        <Descriptions.Item label="id">{orderDetail.id}</Descriptions.Item>
        <Descriptions.Item label="item_discount">{orderDetail.item_discount}</Descriptions.Item>
        <Descriptions.Item label="items">{orderDetail.items}</Descriptions.Item>
        <Descriptions.Item label="promo">{orderDetail.promo}</Descriptions.Item>
        <Descriptions.Item label="shipping">{orderDetail.shipping}</Descriptions.Item>
        <Descriptions.Item label="status">{orderDetail.status}</Descriptions.Item>
        <Descriptions.Item label="subtotal">{orderDetail.subtotal}</Descriptions.Item>
        <Descriptions.Item label="tax">{orderDetail.tax}</Descriptions.Item>
        <Descriptions.Item label="total">{orderDetail.total}</Descriptions.Item>
        <Descriptions.Item label="user_id">{orderDetail.user_id}</Descriptions.Item>
        <Descriptions.Item label="Address">
          No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
        </Descriptions.Item>
      </Descriptions>
    </Page>
  );
};

export default UserDetail;
