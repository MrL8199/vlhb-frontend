import React, { useState } from 'react';
import 'antd/dist/antd.css';
import styles from './index.module.css';
import { Layout, Menu } from 'antd';
import Header from './Header';
import {
  UserOutlined,
  LaptopOutlined,
  DashboardOutlined,
  QrcodeOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import Head from 'next/head';
import { useAuth } from 'contexts';
import Link from 'next/link';
import NProgress from 'nprogress';
import Router from 'next/router';

NProgress.configure({ showSpinner: false });

Router.events.on('routeChangeStart', () => {
  NProgress.start();
});

Router.events.on('routeChangeComplete', () => {
  NProgress.done();
});

Router.events.on('routeChangeError', () => {
  NProgress.done();
});

const { SubMenu } = Menu;
const { Content, Sider, Footer } = Layout;

const AdminLayout: React.FC = ({ children }) => {
  const { currentUser } = useAuth();

  const [collapsed, setCollapsed] = useState(false);

  const onCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <>
      <Head>
        <title>VLHB Shop | Admin </title>
        <meta property="og:title" content="VLHB Shop | Admin" key="title" />
      </Head>
      <Layout style={{ minHeight: '100vh' }}>
        {currentUser && currentUser.role === 'admin' && (
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={onCollapse}
            collapsedWidth={48}
            width={256}
          >
            <div className={collapsed ? styles.logoCollapse : styles.logo}>
              <a className={styles.siderLogo}>
                <img src="/images/logo1.png" alt="logo" />
                {!collapsed && <h1>VLHB Store</h1>}
              </a>
            </div>
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ width: '100%' }}
            >
              <SubMenu key="sub1" icon={<DashboardOutlined />} title="Bảng điều khiển">
                <Menu.Item key="1">
                  <Link href="/dashboard">Thống kê</Link>
                </Menu.Item>
                <Menu.Item key="2">
                  <Link href="/monitor">Theo dõi</Link>
                </Menu.Item>
              </SubMenu>
              <SubMenu key="sub2" icon={<LaptopOutlined />} title="Quản lý Nhập/Xuất">
                <Menu.Item key="3">
                  <Link href="/product">Quản lý sản phẩm</Link>
                </Menu.Item>
                <Menu.Item key="4">
                  <Link href="/category">Quản lý thể loại</Link>
                </Menu.Item>
                <Menu.Item key="5">
                  <Link href="/author">Quản lý tác giả</Link>
                </Menu.Item>
                <Menu.Item key="6">
                  <Link href="/publisher">Quản lý nhà xuất bản</Link>
                </Menu.Item>
              </SubMenu>
              <SubMenu key="sub3" icon={<UserOutlined />} title="Quản lý Tài khoản">
                <Menu.Item key="7">
                  <Link href="/manager">Quản lý tài khoản quản lý</Link>
                </Menu.Item>
                <Menu.Item key="8">
                  <Link href="/user">Danh sách khách hàng</Link>
                </Menu.Item>
              </SubMenu>
              <Menu.Item key="9" icon={<ShoppingCartOutlined />}>
                <Link href="/order">Quản lý Đơn hàng</Link>
              </Menu.Item>
              <Menu.Item key="10" icon={<QrcodeOutlined />}>
                <Link href="/coupon">Quản lý Khuyến mại</Link>
              </Menu.Item>
            </Menu>
          </Sider>
        )}
        <Layout className={styles.siteLayout}>
          {currentUser && currentUser.role === 'admin' && <Header />}
          <Content style={{ margin: '0 16px' }}>{children}</Content>
          <Footer style={{ textAlign: 'center' }}>VLHB Store ©2021 bởi VLCODER</Footer>
        </Layout>
      </Layout>
    </>
  );
};
export default AdminLayout;
