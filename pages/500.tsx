import Link from 'next/link';
import { Result, Button } from 'antd';
import React from 'react';

const InternalServerErrorPage: React.FC = () => (
  <Result
    status="500"
    title="500"
    style={{
      background: 'none',
    }}
    subTitle="Xin lỗi, máy chủ đang báo lỗi."
    extra={
      <Link href="/">
        <Button type="primary">Trở về Trang chủ</Button>
      </Link>
    }
  />
);
export default InternalServerErrorPage;
