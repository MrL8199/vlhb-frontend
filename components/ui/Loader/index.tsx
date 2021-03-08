import React from 'react';
import classNames from 'classnames';
import styles from './Loader.module.css';

const Loader: React.FC<Props> = ({ spinning = false, fullScreen }) => {
  return (
    <div
      className={classNames(styles.loader, {
        [styles.hidden]: !spinning,
        [styles.fullScreen]: fullScreen,
      })}
    >
      <div className={styles.warpper}>
        <div className={styles.inner} />
        <div className={styles.text}>LOADING</div>
      </div>
    </div>
  );
};

interface Props {
  spinning: boolean;
  fullScreen: boolean;
}

export default Loader;
