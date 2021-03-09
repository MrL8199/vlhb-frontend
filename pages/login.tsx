import React from 'react';
import { SignIn } from 'components/auth';
import styles from 'styles/Auth.module.css';

const AdminLogin: React.FC = () => {
  return (
    <>
      <div className={styles.authContainer}>
        <SignIn />
      </div>
    </>
  );
};

export default AdminLogin;
