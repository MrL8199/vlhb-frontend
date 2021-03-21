import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Popconfirm, message, PaginationProps } from 'antd';
import { Page } from 'components/ui';
import { List } from 'components/product';
import { Filter } from 'components/product';
import { Modal } from 'components/product';
import { Product } from 'types';
import { ProductService } from 'services/productService';
import { useRouter } from 'next/router';
import { stringify } from 'querystring';
import { NextPageContext } from 'next';

interface Props {
  products: Product[];
  total: number;
}

const Products: React.FC<Props> = ({ products, total }) => {
  const router = useRouter();
  const { query } = router;

  const [list, setList] = useState<Product[]>(products);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setpagination] = useState<PaginationProps>({
    current: query.page != undefined ? parseFloat(query.page.toString()) : undefined,
    pageSize: query.pageSize != undefined ? parseFloat(query.pageSize.toString()) : undefined,
    total: total,
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
    const fetchData = async () => {
      try {
        setLoading(true);
        setList(products);
        setpagination({
          current: query.page != undefined ? parseFloat(query.page.toString()) : undefined,
          pageSize: query.pageSize != undefined ? parseFloat(query.pageSize.toString()) : undefined,
          total: total,
        });
      } catch (error) {
        message.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [query]);

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
        onAddItem={(item) => {
          setmodalType('add');
          setmodalVisible(true);
          setCurrentItem(item);
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
        title={modalType === 'create' ? 'Thêm sản phẩm' : 'Cập nhật sản phẩm'}
        centered={true}
        onOk={async (data) => {
          try {
            setLoading(true);
            if (modalType === 'create') {
              await ProductService.addProduct(data);
            } else if (modalType === 'update') {
              await ProductService.editProduct(data);
            } else if (modalType === 'add') {
              await ProductService.additionalProduct(data);
            }

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

export const getServerSideProps = async (context: NextPageContext) => {
  const { query } = context;
  const { products, total } = await ProductService.fetchProducts(query);

  return {
    props: { products, total },
  };
};

export default Products;
