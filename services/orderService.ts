import { Order, OrderData, Orders, UpdateOrder } from 'types';
import { catchError } from 'utils/catchError';
import apiClient from 'utils/apiClient';

const getOrders = async (query: string): Promise<Orders> => {
  try {
    const { data } = await apiClient.get(`/orders?${query}`);
    if (!data.status) throw new Error(data.message);

    const ordersData: Orders = {
      items: data.data.items,
      total: data.data.total,
      has_next: data.data.has_next,
      has_prev: data.data.has_prev,
      page: data.data.page,
      pages: data.data.pages,
    };
    return ordersData;
  } catch (error) {
    throw new Error(catchError(error));
  }
};

const updateOrder = async (order: UpdateOrder): Promise<Order> => {
  try {
    const url = `/orders/${order.id}`;
    const { data } = await apiClient.put(url, order);
    if (!data.status) throw new Error(data.message);
    return {
      address: data.data.address,
      content: data.data.content,
      created_at: data.data.created_at,
      discount: data.data.discount,
      grand_total: data.data.grand_total,
      id: data.data.id,
      item_discount: data.data.item_discount,
      items: data.data.items,
      promo: data.data.promo,
      shipping: data.data.shipping,
      status: data.data.status,
      subtotal: data.data.subtotal,
      tax: data.data.tax,
      total: data.data.total,
      user_id: data.data.user_id,
    };
  } catch (error) {
    throw new Error(catchError(error));
  }
};

const deleteOrder = async (id: string): Promise<void> => {
  const url = `/orders/${id}`;
  try {
    const { data } = await apiClient.delete(url);
    if (!data.status) throw new Error(data.message);
    return data.status;
  } catch (error) {
    throw new Error(catchError(error));
  }
};

const fetchOrder = async (id: string): Promise<OrderData> => {
  try {
    const url = `/orders/${id}`;
    const { data } = await apiClient.get(url);
    if (!data.status) throw new Error(data.message);

    const orderData: OrderData = { order: data.data };

    return orderData;
  } catch (error) {
    throw new Error(catchError(error));
  }
};

export const OrderService = {
  getOrders,
  updateOrder,
  deleteOrder,
  fetchOrder,
};
