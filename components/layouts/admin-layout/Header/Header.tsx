import React from 'react';
import { useAuth } from 'contexts';
import styles from './Header.module.css';
import { Dropdown, Menu, message } from 'antd';
import { Layout } from 'antd';
import 'antd/dist/antd.css';
import {
  DownOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
} from '@ant-design/icons';
import Link from 'next/link';

const Header: React.FC = () => {
  const { logout, currentUser, isAuthenticated } = useAuth();

  const { Header } = Layout;

  const onLogOut = () => {
    logout('/admin/login');
  };

  function handleMenuClick(e) {
    message.info('Click on menu item.');
  }

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1" icon={<UserOutlined />}>
        <Link href="admin/profile">Trang cá nhân</Link>
      </Menu.Item>
      <Menu.Item key="2" icon={<SettingOutlined />}>
        <Link href="/admin?selected_page=settings">Cài đặt</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3" onClick={onLogOut} icon={<LogoutOutlined />}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Header className={styles.header}>
        <div className={styles.spacer}></div>
        <nav className={styles.navRight}>
          <Dropdown overlay={menu} placement="bottomCenter">
            <span style={{ padding: '0 12px' }}>
              <BellOutlined />
            </span>
          </Dropdown>
          {isAuthenticated && (
            <>
              <Dropdown overlay={menu} placement="bottomCenter">
                <span>
                  <DownOutlined />
                  {currentUser?.nickname}
                </span>
              </Dropdown>
            </>
          )}
        </nav>
      </Header>
    </>
  );
};

export default Header;
