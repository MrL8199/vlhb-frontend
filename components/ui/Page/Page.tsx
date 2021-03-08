import React, { ReactChild } from 'react';

import classnames from 'classnames';
import Loader from '../Loader';
import styles from './Page.module.css';

interface Props {
  className: string;
  children: ReactChild;
  loading: boolean;
  inner: boolean;
}
const Page: React.FC<Props> = ({ className, children, loading = false, inner = false }) => {
  const loadingStyle = {
    height: 'calc(100vh - 184px)',
    overflow: 'hidden',
  };
  return (
    <div
      className={classnames(className, {
        [styles.contentInner]: inner,
      })}
      style={loading ? loadingStyle : null}
    >
      {loading ? <Loader spinning /> : ''}
      {children}
    </div>
  );
};

export default Page;
