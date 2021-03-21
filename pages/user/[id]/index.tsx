import React from 'react';
import { Page } from 'components/ui';
import { Button, Card, Divider, Image, Space, Table } from 'antd';
import { Descriptions, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { IAddress, User } from 'types';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import moment from 'moment';
import { UserService } from 'services/userService';
import { ColumnsType } from 'antd/lib/table';

interface Props {
  user: User;
  error?: string;
}

const UserDetail: React.FC<Props> = ({ user, error }) => {
  const router = useRouter();

  const columns: ColumnsType<IAddress> = [
    {
      title: 'Tên người nhận',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Xã/phường',
      dataIndex: 'district',
      key: 'district',
    },
    {
      title: 'Quận/huyện',
      dataIndex: 'city',
      key: 'city',
    },
    {
      title: 'Tỉnh/thành phố',
      dataIndex: 'state',
      key: 'state',
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
          <Descriptions title="Thông tin" style={{ marginBottom: 32 }}>
            <Descriptions.Item label="Mã người dùng">
              {'#' + user.id.substr(0, 16)}
            </Descriptions.Item>
            <Descriptions.Item label="Tên tài khoản">{user.user_name}</Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {moment(new Date(user.created_at * 1000)).format('HH:mm:SS - DD/MM/YYYY')}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày cập nhật">
              {moment(new Date(user.updated_at * 1000)).format('HH:mm:SS - DD/MM/YYYY')}
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{user.phone}</Descriptions.Item>
            <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          </Descriptions>
          <Divider style={{ marginBottom: 32 }} />
          <Image width={200} src={user.avatar_url} />
          <Descriptions title="Avatar" style={{ marginBottom: 32 }}></Descriptions>
          <Divider style={{ marginBottom: 32 }} />
          <Descriptions title="Danh sách địa chỉ" style={{ marginBottom: 32 }}>
            <Table style={{ marginBottom: 24 }} pagination={false} columns={columns} rowKey="id" />
          </Descriptions>
        </Card>
      </Space>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.query.id as string;

  try {
    const { user } = await UserService.fetchUser(id);
    return {
      props: { user },
    };
  } catch (error) {
    return {
      props: {
        user: null,
        error: error.message,
      },
    };
  }
};

export default UserDetail;
