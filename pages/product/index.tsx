import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Popconfirm, message } from 'antd';
import { Page } from 'components/ui';
import { List } from 'components/product';
import { Filter } from 'components/product';
import { Modal } from 'components/product';
import { Product } from 'types';
import { ProductService } from 'services/productService';
import { useRouter } from 'next/router';
import { stringify } from 'querystring';
import { GetServerSideProps, NextPageContext } from 'next';

interface Props {
  products: Product[];
  total: number;
}

const Orders: React.FC<Props> = ({ products, total }) => {
  const router = useRouter();
  const { query } = router;

  const [list, setList] = useState<Product[]>(products);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setpagination] = useState({
    current: 1,
    pageSize: 10,
    total: total,
    showSizeChanger: true,
  });
  const [modalType, setmodalType] = useState<string>('create');
  const [modalVisible, setmodalVisible] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<Product>();

  const fetchData = async () => {
    try {
      setLoading(true);
      const results = await ProductService.fetchProducts(query);
      setList(results.products);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteItems = async () => {
    try {
      setLoading(true);
      selectedRowKeys.forEach(async (key) => {
        await ProductService.deleteProduct(key.toString());
      });
      const results = await ProductService.fetchProducts('?');
      setList(results.products);
    } catch (error) {
      message.error(error.message);
    } finally {
      setSelectedRowKeys([]);
      setLoading(false);
    }
  };

  const handleRefresh = (newQuery: any) => {
    const { query, pathname } = router;

    router.push({
      pathname,
      search: stringify({
        ...query,
        ...newQuery,
      }),
    });
    alert('change table: ' + newQuery);
    console.log(newQuery);
  };

  return (
    <Page inner loading={loading} className={'main'}>
      <Filter
        filter={{
          ...query,
        }}
        onFilterChange={(value) => {
          handleRefresh({
            ...value,
          });
        }}
        onAdd={() => {
          setmodalType('create');
          setmodalVisible(true);
        }}
      />
      {selectedRowKeys.length > 0 && (
        <Row style={{ marginBottom: 24, textAlign: 'right', fontSize: 13 }}>
          <Col>
            {`Đã chọn ${selectedRowKeys.length} mục `}
            <Popconfirm
              title="Bạn có chắc chắn xóa những mục này không?"
              cancelText="Hủy"
              placement="left"
              onConfirm={handleDeleteItems}
            >
              <Button type="primary" style={{ marginLeft: 8 }}>
                Xoá
              </Button>
            </Popconfirm>
          </Col>
        </Row>
      )}
      <List
        dataSource={list}
        loading={loading}
        pagination={pagination}
        onChange={(page) => {
          handleRefresh({
            page: page.current,
            pageSize: page.pageSize,
          });
        }}
        onDeleteItem={async (id: string) => {
          try {
            setLoading(true);
            await ProductService.deleteProduct(id);
            message.success('Thành công');
          } catch (e) {
            message.error(e.message);
          } finally {
            setLoading(false);
            fetchData();
          }
        }}
        onEditItem={(item) => {
          setmodalType('update');
          setmodalVisible(true);
          setCurrentItem(item);
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys);
          },
        }}
      />
      <Modal
        item={modalType === 'create' ? undefined : currentItem}
        visible={modalVisible}
        type={modalType}
        destroyOnClose={true}
        maskClosable={false}
        confirmLoading={loading}
        title={modalType === 'create' ? 'Tạo đơn hàng' : 'Cập nhật đơn hàng'}
        centered={true}
        onOk={async (data) => {
          try {
            setLoading(true);

            await ProductService.editProduct(data);

            message.success('Thành công');
          } catch (e) {
            message.error(e.message);
          } finally {
            setLoading(false);
            setmodalVisible(false);
            fetchData();
          }
        }}
        onCancel={() => {
          setmodalVisible(false);
        }}
      />
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: NextPageContext) => {
  const { query } = context;
  console.log(query);
  const { products, total } = await ProductService.fetchProducts(query);

  return {
    props: { products, total },
  };
};

export default Orders;
