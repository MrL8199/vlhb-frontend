import React from 'react';
import { BarsOutlined, DownOutlined } from '@ant-design/icons';
import { Dropdown, Button, Menu } from 'antd';

const DropOption: React.FC<Props> = ({ onMenuClick, menuOptions = [] }) => {
  const menu = menuOptions.map((item: { key: string; name: string }) => (
    <Menu.Item key={item.key}>{item.name}</Menu.Item>
  ));
  return (
    <Dropdown overlay={<Menu onClick={onMenuClick}>{menu}</Menu>}>
      <Button style={{ border: 'none' }}>
        <BarsOutlined style={{ marginRight: 2 }} />
        <DownOutlined />
      </Button>
    </Dropdown>
  );
};

interface MenuInfo {
  key: React.Key;
  keyPath: React.Key[];
  item: React.ReactInstance;
  domEvent: React.MouseEvent<HTMLElement>;
}

interface Props {
  onMenuClick(e: MenuInfo): void;
  menuOptions: { key: string; name: string }[];
}

export default DropOption;
