import React, { useState } from 'react';
import { Row, Col, Button, Popconfirm, message } from 'antd';
import { Page } from 'components/ui';
import { List } from 'components/coupon';
import { Filter } from 'components/coupon';
import { Modal } from 'components/coupon';
import { Coupon } from 'types';
import { CouponService } from 'services/couponService';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';

interface Props {
  coupons: Coupon[];
}

const Categories: React.FC<Props> = ({ coupons }) => {
  const router = useRouter();
  const { query } = router;

  const [list, setList] = useState<Coupon[]>(coupons);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setpagination] = useState({ current: 1, pageSize: 10, total: list.length });
  const [modalType, setmodalType] = useState<string>('create');
  const [modalVisible, setmodalVisible] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<Coupon>();

  const fetchData = async () => {
    try {
      setLoading(true);
      const results = await CouponService.getCoupons();
      setList(results.coupons);
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
        await CouponService.deleteCoupon(key.toString());
      });
      const results = await CouponService.getCoupons();
      setList(results.coupons);
    } catch (error) {
      message.error(error.message);
    } finally {
      setSelectedRowKeys([]);
      setLoading(false);
    }
  };

  const handleRefresh = (newQuery: any) => {
    setpagination(newQuery);
  };

  const handleFilter = (query: any) => {
    let newList: Coupon[] = list;
    const name = query.name;
    const createTime = query.createTime;
    if (name) {
      newList = newList.filter((item) => item.code.toLowerCase().includes(name.toLowerCase()));
    }
    if (createTime.length != 0) {
      newList = newList.filter(
        (item) => item.created_at >= createTime[0] && item.created_at <= createTime[1]
      );
    }
    if (name === undefined && createTime.length == 0) fetchData();
    setList(newList);
  };

  return (
    <Page inner loading={loading} className={'main'}>
      <Filter
        filter={{
          ...query,
        }}
        onFilterChange={(value) => {
          handleFilter({
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
            await CouponService.deleteCoupon(id);
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
        title={modalType === 'create' ? 'Thêm mã giảm giá' : 'Cập nhật mã giảm giá'}
        centered={true}
        onOk={async (data) => {
          try {
            setLoading(true);
            if (modalType === 'create') {
              await CouponService.addCoupon(data);
            } else {
              await CouponService.updateCoupon(data);
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
  const { coupons } = await CouponService.getCoupons();

  return {
    props: { coupons },
  };
};

export default Categories;
