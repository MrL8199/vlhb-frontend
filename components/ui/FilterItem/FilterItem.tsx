import React from 'react';
import styles from './FilterItem.module.css';

const FilterItem: React.FC<Props> = ({ label = '', children }) => {
  const labelArray = label.split('');
  return (
    <div className={styles.filterItem}>
      {labelArray.length > 0 && (
        <div className={styles.labelWrap}>
          {labelArray.map((item, index) => (
            <span className="labelText" key={index}>
              {item}
            </span>
          ))}
        </div>
      )}
      <div className={styles.item}>{children}</div>
    </div>
  );
};

interface Props {
  label: string;
  children: Element;
}

export default FilterItem;
