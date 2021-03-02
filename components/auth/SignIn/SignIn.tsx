import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert } from 'antd';
import React, { useState } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { useAuth, useToast } from 'contexts';
import styles from './SignIn.module.css';
import { Meta } from 'components/core';
import { PageLoader } from 'components/ui';
import 'antd/dist/antd.css';
import Link from 'next/link';

type LoginParamsType = {
  username: string;
  password: string;
};

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message="Lỗi"
    closable
    description={content}
    type="error"
    showIcon
  />
);

const Login: React.FC = () => {
  const { login } = useAuth();

  const { setToast } = useToast();

  const [status, setStatus] = useState('');

  const [errMsg, setErrMsg] = useState('');

  const [submitting, setSubmitting] = useState(false);

  const initialValues = {
    autoLogin: true,
    username: '',
    password: '',
  };

  const handleSubmit = async (values: LoginParamsType) => {
    try {
      setSubmitting(true);
      await login(values.username, values.password, true);
    } catch (error) {
      setStatus('error');
      setErrMsg(error.message);
      setSubmitting(false);
    }
  };
  return (
    <>
      <Meta title="Đăng nhập" />
      {submitting && <PageLoader />}
      <div className={styles.main}>
        <h1>Đăng nhập trang quản trị</h1>
        <Form
          initialValues={initialValues}
          onFinish={(values) => {
            handleSubmit(values as LoginParamsType);
            return Promise.resolve();
          }}
        >
          {status === 'error' && !submitting && <LoginMessage content={errMsg} />}
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập tài khoản',
              },
            ]}
          >
            <Input
              className={styles.input}
              prefix={<UserOutlined className={styles.prefixIcon} />}
              placeholder={'Tên tài khoản'}
              allowClear={true}
            ></Input>
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mật khẩu',
              },
            ]}
          >
            <Input.Password
              className={styles.input}
              prefix={<LockOutlined className={styles.prefixIcon} />}
              placeholder={'Mật khẩu'}
            ></Input.Password>
          </Form.Item>
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <Form.Item noStyle name="autoLogin">
              <Checkbox>Tự động đăng nhập</Checkbox>
            </Form.Item>
            <Link href="/forgot_password">
              <a className={styles.loginFormForgot}>Quên mật khẩu?</a>
            </Link>
          </div>
          <Form.Item>
            <Button type="primary" htmlType="submit" className={styles.loginFormButton}>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default Login;
