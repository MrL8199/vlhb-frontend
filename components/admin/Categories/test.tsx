import React, { useState, useEffect } from 'react';
import { Category } from 'types';
import { CategoryService } from 'services';
import { ErrorMessage } from 'components/ui';
import 'antd/dist/antd.css';
import { Table, Popconfirm, Typography, Spin } from 'antd';
import { useToast } from 'contexts';

const Categories: React.FC = () => {
  const { setToast } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [data, setData] = useState(categories);
  const [editingKey, setEditingKey] = useState('');
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const results = await CategoryService.getCategories();
        setCategories(results.categories);
        setTotal(results.total);
        setData(results.categories);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return <Spin size={'large'} />;
  }

  if (error) {
    return <ErrorMessage message="Không thể nhận danh mục ngay bây giờ, vui lòng thử lại sau." />;
  }

  const columns = [
    {
      title: 'Tên thể loại',
      dataIndex: 'name',
      sorter: true,
      width: '70%',
      editable: true,
    },
    {
      title: 'Hành động',
      dataIndex: 'operation',
      render: (_: any) => {
        const editable = false;
        return editable ? (
          <span>
            <a
              href="javascript:;"
              style={{
                marginRight: 8,
              }}
            >
              Lưu
            </a>
            <Popconfirm title="Chắc chắn hủy bỏ?">
              <a>Hủy</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''}>Sửa</Typography.Link>
        );
      },
    },
  ];
  const handleTableChange = (pagination, filters, sorter) => {
    fetch({
      sortField: sorter.field,
      sortOrder: sorter.order,
      pagination,
      ...filters,
    });
  };

  return (
    <Table
      columns={columns}
      rowKey={(record) => record.id}
      dataSource={data}
      pagination={{ current: page, pageSize: pageSize }}
      loading={loading}
      onChange={handleTableChange}
    />
  );
};

export default Categories;
