import React, { useState } from 'react';
import { Row, Col, Button, Popconfirm, message } from 'antd';
import { Page } from 'components/ui';
import { List } from './components';
import { Filter } from './components';
import { Modal } from './components';
import { Publisher } from 'types';
import { PublisherService } from 'services/publisherService';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';

interface Props {
  publishers: Publisher[];
}

const Publishers: React.FC<Props> = ({ publishers }) => {
  const router = useRouter();
  const { query } = router;

  const [list, setList] = useState<Publisher[]>(publishers);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setpagination] = useState({ current: 1, pageSize: 10, total: list.length });
  const [modalType, setmodalType] = useState<string>('create');
  const [modalVisible, setmodalVisible] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<Publisher>();

  const fetchData = async () => {
    try {
      setLoading(true);
      const results = await PublisherService.getPublishers();
      setList(results.publishers);
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
        await PublisherService.deletePublisher(key.toString());
      });
      const results = await PublisherService.getPublishers();
      setList(results.publishers);
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
            await PublisherService.deletePublisher(id);
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
        type={modalType}
        visible={modalVisible}
        destroyOnClose={true}
        maskClosable={false}
        confirmLoading={loading}
        title={modalType === 'create' ? 'Thêm nhà xuất bản' : 'Cập nhật nhà xuất bản'}
        centered={true}
        onOk={async (data) => {
          try {
            setLoading(true);
            if (modalType === 'create') {
              await PublisherService.addPublisher(data);
            } else {
              await PublisherService.updatePublisher(data);
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
  const { publishers } = await PublisherService.getPublishers();

  return {
    props: { publishers },
  };
};

export default Publishers;
