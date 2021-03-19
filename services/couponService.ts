import { catchError } from 'utils/catchError';
import apiClient from 'utils/apiClient';
import { CouponsData, Coupon, AddCouponData } from 'types/coupon';

const getCoupons = async (): Promise<CouponsData> => {
  try {
    const { data } = await apiClient.get(`/coupons`);
    if (!data.status) throw new Error(data.message);

    const categoriesData: CouponsData = {
      coupons: data.data.items,
      total: data.data.total,
    };

    return categoriesData;
  } catch (error) {
    throw new Error(catchError(error));
  }
};

const addCoupon = async (coupon: Coupon): Promise<AddCouponData> => {
  try {
    const url = '/coupons/';
    const { data } = await apiClient.post(url, coupon);
    if (!data.status) throw new Error(data.message);
    return {
      coupon: data.data,
    };
  } catch (error) {
    throw new Error(catchError(error));
  }
};

const updateCoupon = async (coupon: Coupon): Promise<AddCouponData> => {
  try {
    const url = `/coupons/${coupon.id}`;
    const { data } = await apiClient.put(url, coupon);
    if (!data.status) throw new Error(data.message);
    return {
      coupon: data.data,
    };
  } catch (error) {
    throw new Error(catchError(error));
  }
};

const deleteCoupon = async (id: string): Promise<void> => {
  const url = `/coupons/${id}`;
  try {
    const { data } = await apiClient.delete(url);
    if (!data.status) throw new Error(data.message);
    return data.status;
  } catch (error) {
    throw new Error(catchError(error));
  }
};

const fetchCoupon = async (id: string): Promise<AddCouponData> => {
  try {
    const url = `/coupons/${id}`;
    const { data } = await apiClient.get(url);
    if (!data.status) throw new Error(data.message);

    const couponData: AddCouponData = {
      coupon: data.data,
    };

    return couponData;
  } catch (error) {
    throw new Error(catchError(error));
  }
};

export const CouponService = {
  getCoupons,
  updateCoupon,
  deleteCoupon,
  addCoupon,
  fetchCoupon,
};
