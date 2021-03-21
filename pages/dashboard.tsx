import { Table, Button, Image, Tabs, message } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Filter } from 'components/dashboard';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { DashboardService } from 'services';
import { ImportProductData, IProductRevenue, IProductSeller } from 'services/dashboardService';
import { API_URL } from 'utils/constants';

const { TabPane } = Tabs;
interface Props {
  saleData: IProductSeller[];
}

const Admin: React.FC<Props> = ({ saleData }) => {
  const router = useRouter();
  const { query } = router;

  const [listRevenue, setListRevenue] = useState<IProductRevenue[]>([]);
  const [listImport, setListImport] = useState<ImportProductData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterDate, setFilterDate] = useState<number[]>([]);

  const columns: ColumnsType<IProductSeller> = [
    {
      title: 'Sản phẩm',
      dataIndex: 'product',
      key: 'product',
      render: (text, record) => (
        <>
          <p>{record.product.title}</p>
          <Image
            width={160}
            height={200}
            src={record.product.images[0].url}
            fallback={'/images/default_img.png'}
            placeholder={
              <Image preview={false} src={'/images/default_img.png'} width={160} height={200} />
            }
          />
        </>
      ),
    },
    {
      title: 'Giá tiền',
      dataIndex: 'product',
      key: 'product',
      render: (text, record) => (
        <>{record.product.price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</>
      ),
    },
    {
      title: 'Số lượng bán',
      dataIndex: 'sale_quantity',
      key: 'sale_quantity',
    },
  ];

  const columnsRevenue: ColumnsType<IProductRevenue> = [
    {
      title: 'Sản phẩm',
      dataIndex: 'product',
      key: 'product',
      render: (text, record) => (
        <>
          <p>{record.product.title}</p>
          <Image
            width={160}
            height={200}
            src={record.product.images[0].url}
            fallback={'/images/default_img.png'}
            placeholder={
              <Image preview={false} src={'/images/default_img.png'} width={160} height={200} />
            }
          />
        </>
      ),
    },
    {
      title: 'Giá tiền',
      dataIndex: 'product',
      key: 'product',
      render: (text, record) => (
        <>{record.product.price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</>
      ),
    },
    {
      title: 'Tổng doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (text) => <>{text.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</>,
    },
  ];

  const columnsImportCost: ColumnsType<ImportProductData> = [
    {
      title: 'ID sản phẩm',
      dataIndex: 'product',
      key: 'product',
      width: 88,
      render: (text, record) => (
        <Link href={`product/${record.product.id}`}>{'#' + record.product.id.substr(0, 4)}</Link>
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'product',
      key: 'product',
      render: (text, record) => record.product.title,
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'product',
      key: 'product',
      render: (text, record) => (
        <>
          <Image
            width={160}
            height={200}
            src={record.product.images[0].url}
            fallback={'/images/default_img.png'}
            placeholder={
              <Image preview={false} src={'/images/default_img.png'} width={160} height={200} />
            }
          />
        </>
      ),
    },
    {
      title: 'Giá bán',
      dataIndex: 'product',
      key: 'product',
      render: (text, record) => (
        <>{record.product.price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</>
      ),
    },
    {
      title: 'Giá mua',
      dataIndex: 'cost',
      key: 'cost',
      render: (cost) => <>{cost.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</>,
    },
    {
      title: 'Số lượng nhập',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Tổng vốn',
      dataIndex: 'total',
      key: 'total',
      render: (total) => (
        <>{total.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</>
      ),
    },
  ];

  const fetchData = async (newQuery: any) => {
    try {
      setLoading(true);
      const { revenueData } = await DashboardService.getBestRevenue();
      setListRevenue(revenueData);
      const { arrData } = await DashboardService.getImportData(
        newQuery.from_date,
        newQuery.to_date
      );
      setFilterDate([newQuery.from_date, newQuery.to_date]);
      setListImport(arrData);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Tabs defaultActiveKey="1" onChange={fetchData}>
        <TabPane tab="Top 10 sản phẩm bán nhiều nhất" key="1">
          <Table
            title={() => 'Top 10 sản phẩm có số lượng bán nhiều nhất'}
            pagination={false}
            dataSource={saleData}
            columns={columns}
          />
        </TabPane>
        <TabPane tab="Top 10 sản phẩm có doanh thu cao nhất" key="2">
          <Table
            loading={loading}
            title={() => 'Top 10 sản phẩm có doanh thu cao nhất'}
            pagination={false}
            dataSource={listRevenue}
            columns={columnsRevenue}
          />
        </TabPane>
        <TabPane tab="Thống kê nhập hàng" key="3">
          <Filter
            filter={{
              ...query,
            }}
            onFilterChange={(value) => {
              fetchData({
                ...value,
              });
            }}
          />
          <Table
            loading={loading}
            title={() => (
              <Button>
                <Link
                  href={`${API_URL}/dashboard/import-statistics?from-date=${filterDate[0]}&to-date=${filterDate[1]}/excel`}
                >
                  Xuất file excel
                </Link>
              </Button>
            )}
            dataSource={listImport}
            columns={columnsImportCost}
          />
        </TabPane>
      </Tabs>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const { saleData } = await DashboardService.getBestSeller();
    return {
      props: { saleData },
    };
  } catch (error) {
    return {
      props: {
        saleData: null,
        error: error.message,
      },
    };
  }
};

export default Admin;
