import React from 'react';
import { Spin } from 'antd';
import styles from './PageLoader.module.css';

const PageLoader: React.FC = () => {
  return (
    <>
      <div className={styles.pageLoader}>
        <Spin size="large" />
      </div>
    </>
  );
};

export default PageLoader;
