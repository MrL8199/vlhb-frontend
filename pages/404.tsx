import { Button, Result } from 'antd';
import React from 'react';

const NoFoundPage: React.FC = () => (
  <Result
    status="404"
    title="404"
    subTitle="Xin lỗi, trang bạn truy cập không tồn tại."
    extra={
      <Button type="primary" onClick={() => window.history.back()}>
        Trở lại
      </Button>
    }
  />
);

export default NoFoundPage;
