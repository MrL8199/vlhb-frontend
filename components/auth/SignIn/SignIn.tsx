import { Alert, Row } from 'antd';
import React, { Fragment, useState } from 'react';
import { Form, Input, Button } from 'antd';
import { useAuth } from 'contexts';
import styles from './SignIn.module.css';
import { Meta } from 'components/core';
import { PageLoader } from 'components/ui';
import 'antd/dist/antd.css';
import config from 'utils/config';

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
      await login(values.username, values.password, false);
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
      {status === 'error' && !submitting && <LoginMessage content={errMsg} />}
      <Fragment>
        <div className={styles.form}>
          <div className={styles.logo}>
            <img alt="logo" src={'/images/logo.png'} />
            <span>{config.siteName}</span>
          </div>
          <Form
            initialValues={initialValues}
            onFinish={(values) => {
              handleSubmit(values as LoginParamsType);
              return Promise.resolve();
            }}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tài khoản',
                },
              ]}
              hasFeedback
            >
              <Input placeholder={`Username`} />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập mật khẩu',
                },
              ]}
              hasFeedback
            >
              <Input type="password" placeholder={'password'} />
            </Form.Item>
            <Row>
              <Button type="primary" htmlType="submit" loading={submitting}>
                Đăng nhập
              </Button>
            </Row>
          </Form>
        </div>
      </Fragment>
    </>
  );
};

export default Login;
