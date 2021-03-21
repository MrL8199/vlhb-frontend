import React from 'react';
import { Page } from 'components/ui';
import { Button, Card, Divider, Image, Space } from 'antd';
import { Descriptions, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Product } from 'types';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import moment from 'moment';
import { ProductService } from 'services';

interface Props {
  product: Product;
  error?: string;
}

const ProductDetail: React.FC<Props> = ({ product, error }) => {
  const router = useRouter();

  return (
    <Page inner loading={false} className={'main'}>
      {error != null && message.error(error)}
      <Space direction="vertical">
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
          Quay lại
        </Button>
        <Card bordered={false}>
          <Descriptions title="Thông tin" style={{ marginBottom: 32 }}>
            <Descriptions.Item label="Mã sản phẩm">
              {'#' + product.id.substr(0, 16)}
            </Descriptions.Item>
            <Descriptions.Item label="Tên sản phẩm">{product.title}</Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {moment(new Date(product.created_at * 1000)).format('HH:mm:SS - DD/MM/YYYY')}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày cập nhật">
              {moment(new Date(product.updated_at * 1000)).format('HH:mm:SS - DD/MM/YYYY')}
            </Descriptions.Item>
            <Descriptions.Item label="Giá tiền">
              {product.price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
            </Descriptions.Item>
            <Descriptions.Item label="Giảm giá">
              {product.discount.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
            </Descriptions.Item>
            <Descriptions.Item label="Số lượng còn">{product.quantity}</Descriptions.Item>
          </Descriptions>
          <Divider style={{ marginBottom: 32 }} />
          <Descriptions title="Thông tin chi tiết" style={{ marginBottom: 32 }}>
            <Descriptions.Item label="Năm xuất bản">{product.publish_year}</Descriptions.Item>
            <Descriptions.Item label="Số trang">{product.page_number}</Descriptions.Item>
            <Descriptions.Item label="Tác giả">{product.author.name}</Descriptions.Item>
            <Descriptions.Item label="Thể loại">{product.category.name}</Descriptions.Item>
            <Descriptions.Item label="Nhà xuất bản">{product.publisher.name}</Descriptions.Item>
          </Descriptions>
          <Divider style={{ marginBottom: 32 }} />
          <div>Hình ảnh sản phẩm</div>
          <Image.PreviewGroup>
            {product.images.map((item) => {
              return <Image key={item.toString()} width={200} src={item.toString()} />;
            })}
          </Image.PreviewGroup>
          <Divider style={{ marginBottom: 32 }} />
          <Descriptions title="Trích dẫn từ sách" style={{ marginBottom: 32 }}>
            <Descriptions.Item label="Nội dung">{product.quotes_about}</Descriptions.Item>
          </Descriptions>
        </Card>
        {/* 

          
          <Descriptions.Item label="Giảm giá">{product.discount}</Descriptions.Item>
          <Descriptions.Item label="Tổng cộng">{product.subtotal}</Descriptions.Item>
          <Descriptions.Item label="Thuế">{product.tax}</Descriptions.Item>
          <Descriptions.Item label="Tổng (tạm tính)">{product.total}</Descriptions.Item>
              <Descriptions.Item label="Tổng giảm giá sản phẩm">
                {product.item_discount}
              </Descriptions.Item>
              <Descriptions.Item label="Mã giảm giá">{product.promo}</Descriptions.Item>
              <Descriptions.Item label="Phí ship">{product.shipping}</Descriptions.Item>
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
    const { product } = await ProductService.fetchProduct(id);
    return {
      props: { product },
    };
  } catch (error) {
    return {
      props: {
        product: null,
        error: error.message,
      },
    };
  }
};

export default ProductDetail;
