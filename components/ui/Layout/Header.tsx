import React, { Fragment } from 'react';
import { Menu, Layout, Avatar, Popover, Badge, List } from 'antd';
import { Ellipsis } from 'components/ui';
import {
  BellOutlined,
  RightOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import classnames from 'classnames';
import styles from './Header.modules.css';
import { User } from 'types';

const { SubMenu } = Menu;

interface Props {
  fixed: boolean;
  user: User;
  menus: any;
  collapsed: boolean;
  onSignOut: void;
  notifications: string[];
  onCollapseChange: void;
  onAllNotificationsRead: void;
}

const Header: React.FC<Props> = ({
  fixed,
  user,
  collapsed,
  onSignOut,
  notifications,
  onCollapseChange,
  onAllNotificationsRead,
}) => {
  const handleClickMenu = (e: { key: string }) => {
    e.key === 'SignOut' && onSignOut;
  };

  const rightContent = [
    <Menu key="user" mode="horizontal" onClick={handleClickMenu}>
      <SubMenu
        title={
          <Fragment>
            <span style={{ color: '#999', marginRight: 4 }}>Xin chào,</span>
            <span>{user.username}</span>
            <Avatar style={{ marginLeft: 8 }} src={user.avatar} />
          </Fragment>
        }
      >
        <Menu.Item key="SignOut">Đăng xuất</Menu.Item>
      </SubMenu>
    </Menu>,
  ];

  rightContent.unshift(
    <Popover
      placement="bottomRight"
      trigger="click"
      key="notifications"
      overlayClassName={styles.notificationPopover}
      getPopupContainer={() => document.querySelector('#primaryLayout')}
      content={
        <div className={styles.notification}>
          <List
            itemLayout="horizontal"
            dataSource={notifications}
            locale={{
              emptyText: 'Bạn đã đọc hết tất cả thông báo.',
            }}
            renderItem={(item) => (
              <List.Item className={styles.notificationItem}>
                <List.Item.Meta
                  title={
                    <Ellipsis tooltip lines={1}>
                      {item.title}
                    </Ellipsis>
                  }
                  description={moment(item.date).fromNow()}
                />
                <RightOutlined style={{ fontSize: 10, color: '#ccc' }} />
              </List.Item>
            )}
          />
          {notifications.length ? (
            <div onClick={onAllNotificationsRead} className={styles.clearButton}>
              Clear notifications
            </div>
          ) : null}
        </div>
      }
    >
      <Badge count={notifications.length} dot offset={[-10, 10]} className={styles.iconButton}>
        <BellOutlined className={styles.iconFont} />
      </Badge>
    </Popover>
  );

  return (
    <Layout.Header
      className={classnames(styles.header, {
        [styles.fixed]: fixed,
        [styles.collapsed]: collapsed,
      })}
      id="layoutHeader"
    >
      <div className={styles.button} onClick={onCollapseChange.bind(this, !collapsed)}>
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </div>
      <div className={styles.rightContainer}>{rightContent}</div>
    </Layout.Header>
  );
};

export default Header;
