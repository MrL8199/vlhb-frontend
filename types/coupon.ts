export type Coupon = {
  amount: number;
  code: string;
  created_at: number;
  description: string;
  end_date: number;
  id: string;
  is_enable: boolean;
  max_value: number;
  start_date: number;
  updated_at: number;
  value: number;
};

export interface CouponsData {
  coupons: Coupon[];
  total: number;
}

export interface AddCouponData {
  coupon: Coupon;
}
