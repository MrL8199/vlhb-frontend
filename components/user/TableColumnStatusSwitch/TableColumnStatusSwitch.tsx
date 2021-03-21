import cx from 'classnames';
import React, { useState } from 'react';
import { Switch, message } from 'antd';
import { SwitchSize } from 'antd/es/switch';

import style from './style.module.css';
import apiClient from 'utils/apiClient';
import { API_URL } from 'utils/constants';

interface IProps {
  apiPath: string;
  id: string;
  value?: number;
  size?: SwitchSize;
  onSuccessCallback?: () => void;
  className?: string;
}

export const TableColumnStatusSwitch: React.FC<IProps> = (props: IProps) => {
  const [status, setStatus] = useState<boolean>(Boolean(props.value));
  const [loading, setLoadin] = useState(false);

  const onChange = (v: boolean) => {
    setLoadin(true);

    apiClient
      .patch(`${API_URL}/${props.apiPath}/${props.id}`, {
        is_admin: Number(v),
      })
      .then((res) => {
        setStatus(Boolean(res.data.data?.is_admin));

        message.success(
          <span>
            {`Cập nhật thành công: ${props.id}`}
            <Switch
              checked={Boolean(res.data.data?.is_admin)}
              size="small"
              className={style['tips-switch']}
            />
          </span>
        );

        if (props.onSuccessCallback) props.onSuccessCallback();
      })
      .catch((err) => message.error(err.response?.data?.message || err.message))
      .finally(() => setLoadin(false));
  };

  return (
    <div className={cx(style['table-column-status-switch-comp-wrapper'], props.className)}>
      <Switch checked={status} onChange={onChange} size={props.size} loading={loading} />
    </div>
  );
};
