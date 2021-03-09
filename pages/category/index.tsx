import React, { useState } from 'react';
import { Row, Col, Button, Popconfirm, message } from 'antd';
import { Page } from 'components/ui';
import { List } from './components';
import { Filter } from './components';
import { Modal } from './components';
import { Category } from 'types';
import { CategoryService } from 'services/categoryService';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';

interface Props {
  categories: Category[];
}

const Categories: React.FC<Props> = ({ categories }) => {
  const router = useRouter();
  const { query } = router;

  const [list, setList] = useState<Category[]>(categories);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setpagination] = useState({ current: 1, pageSize: 10, total: list.length });
  const [modalType, setmodalType] = useState<string>('create');
  const [modalVisible, setmodalVisible] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<Category>();

  const fetchData = async () => {
    try {
      setLoading(true);
      const results = await CategoryService.getCategories();
      setList(results.categories);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItems = async () => {
    try {
      setLoading(true);
      selectedRowKeys.forEach(async (key) => {
        await CategoryService.deleteCategory(key);
      });
      const results = await CategoryService.getCategories();
      setList(results.categories);
    } catch (error) {
      message.error(error.message);
    } finally {
      setSelectedRowKeys([]);
      setLoading(false);
    }
  };

  const handleRefresh = (newQuery: any) => {
    alert('change table: ' + newQuery);
    console.log(newQuery);
    setpagination(newQuery);
  };

  return (
    <Page inner loading={loading}>
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
            await CategoryService.deleteCategory(id);
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
        item={modalType === 'create' ? {} : currentItem}
        type={modalType}
        visible={modalVisible}
        destroyOnClose={true}
        maskClosable={false}
        confirmLoading={loading}
        title={modalType === 'create' ? 'Thêm thể loại' : 'Cập nhật thể loại'}
        centered={true}
        onOk={async (data) => {
          try {
            setLoading(true);
            if (modalType === 'create') {
              await CategoryService.addCategory(data);
            } else {
              await CategoryService.updateCategory(data);
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

export const getServerSideProps: GetServerSideProps = async () => {
  const { categories } = await CategoryService.getCategories();

  return {
    props: { categories },
  };
};

export default Categories;
