import apiClient from 'utils/apiClient';
import { catchError } from 'utils/catchError';

interface DashboardData {
  products: number;
  orders: number;
  users: number;
}

export type IProduct = {
  id: string;
  images: { id: string; url: string }[];
  price: number;
  title: string;
};

export type IProductSeller = {
  product: IProduct;
  sale_quantity: number;
};

export type IProductRevenue = {
  product: IProduct;
  revenue: number;
};

export type BestSellerData = {
  saleData: IProductSeller[];
};

export type BestRevenueData = {
  revenueData: IProductRevenue[];
};

export type ImportProductData = {
  product: IProduct;
  cost: number;
  quantity: number;
  title: string;
  total: number;
};

export type ArrImportProductData = {
  arrData: ImportProductData[];
};

const getDashboard = async (): Promise<DashboardData> => {
  try {
    const { data } = await apiClient.get(`/dashboard`);

    const dashboardData: DashboardData = {
      products: data.data.products,
      orders: data.data.orders,
      users: data.data.users,
    };

    return dashboardData;
  } catch (error) {
    throw new Error(catchError(error));
  }
};

const getBestSeller = async (): Promise<BestSellerData> => {
  try {
    const { data } = await apiClient.get(`/dashboard/best-seller`);

    const dashboardData: BestSellerData = {
      saleData: data.data,
    };

    return dashboardData;
  } catch (error) {
    throw new Error(catchError(error));
  }
};

const getBestRevenue = async (): Promise<BestRevenueData> => {
  try {
    const { data } = await apiClient.get(`/dashboard/best-revenue`);

    const dashboardData: BestRevenueData = {
      revenueData: data.data,
    };

    return dashboardData;
  } catch (error) {
    throw new Error(catchError(error));
  }
};

const getImportData = async (from: number, to: number): Promise<ArrImportProductData> => {
  try {
    const { data } = await apiClient.get(
      `/dashboard/import-statistics?from-date=${from}&to-date=${to}`
    );

    const dashboardData: ArrImportProductData = {
      arrData: data.data,
    };

    return dashboardData;
  } catch (error) {
    throw new Error(catchError(error));
  }
};

export const DashboardService = {
  getDashboard,
  getBestSeller,
  getBestRevenue,
  getImportData,
};
