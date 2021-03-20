import React, { useState } from 'react';
import { Row, Col, Button, Popconfirm, message } from 'antd';
import { Page } from 'components/ui';
import { List } from 'components/user';
import { Filter } from 'components/user';
import { Modal } from 'components/user';
import { User } from 'types';
import { UserService } from 'services/userService';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';

interface Props {
  users: User[];
}

const Users: React.FC<Props> = ({ users }) => {
  const router = useRouter();
  const { query } = router;

  const [list, setList] = useState<User[]>(users);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: list.length });
  const [modalType, setModalType] = useState<string>('create');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<User>();

  const fetchData = async () => {
    try {
      setLoading(true);
      const results = await UserService.getUsers();
      // setList(results.users);
      console.log('fetchData', results)
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
        await UserService.deleteUser(key.toString());
      });
      const results = await UserService.getUsers();
      // setList(results.users);
    } catch (error) {
      message.error(error.message);
    } finally {
      setSelectedRowKeys([]);
      setLoading(false);
    }
  };

  const handleRefresh = (newQuery: any) => {
    setPagination(newQuery);
  };

  const handleFilter = (query: any) => {
    let newList: User[] = list;
    const name = query.name;
    const createTime = query.createTime;
    if (name) {
      newList = newList.filter((item) => item.nickname.toLowerCase().includes(name.toLowerCase()));
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
          setModalType('create');
          setModalVisible(true);
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
            await UserService.deleteUser(id);
            message.success('Thành công');
          } catch (e) {
            message.error(e.message);
          } finally {
            setLoading(false);
            fetchData();
          }
        }}
        onEditItem={(item) => {
          setModalType('update');
          setModalVisible(true);
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
        title={modalType === 'create' ? 'Thêm người dùng mới' : 'Cập nhật người dùng'}
        centered={true}
        onOk={async (data) => {
          try {
            setLoading(true);
            if (modalType === 'create') {
              await UserService.addUser({
                full_name: data.nickname,
                email: data.email,
                phone: data.phone,
                user_name: data.user_name,
                password: data.password,
                is_admin : data.is_admin,
              });
            } else {
              await UserService.updateUser({
                first_name: data.nickname,
                last_name: "",
                email: data.email,
                phone: data.phone,
              });
            }
            message.success('Thành công');
          } catch (e) {
            message.error(e.message);
          } finally {
            setLoading(false);
            setModalVisible(false);
            fetchData();
          }
        }}
        onCancel={() => {
          setModalVisible(false);
        }}
      />
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const { users } = await UserService.getUsers();

  return {
    props: { users },
  };
};

export default Users;
