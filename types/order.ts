import { Product } from './product';

export interface IOrderProduct {
  created_at: number;
  discount: number;
  id: string;
  price: number;
  product: Product;
  quantity: number;
}

export interface IAddress {
  address: string;
  city: string;
  default: boolean;
  district: string;
  email: string;
  id: string;
  name: string;
  phone: string;
  state: string;
  user_id: string;
}

export interface UpdateOrder {
  id: string;
  status: string;
}

export interface Orders {
  has_next: boolean;
  has_prev: boolean;
  items: Order[];
  page: number;
  pages: number;
  total: number;
}

export type Order = {
  address: IAddress;
  content: string;
  created_at: number;
  discount: number;
  grand_total: number;
  id: string;
  item_discount: number;
  items: IOrderProduct[];
  promo: string;
  shipping: number;
  status: number;
  subtotal: number;
  tax: number;
  total: number;
  user_id: string;
};

export type OrderData = {
  order: Order;
};
