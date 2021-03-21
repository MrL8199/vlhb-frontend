import { ProductData, ProductsData, Product } from 'types';
import { catchError } from 'utils/catchError';
import apiClient from 'utils/apiClient';
const qs = require('qs');

const fetchProducts = async (params?: any): Promise<ProductsData> => {
  try {
    params = qs.stringify(params, { encodeValuesOnly: true });
    const url = `/products/all?${params}`;
    const { data } = await apiClient.get(url);
    if (!data.status) throw new Error(data.message);

    const productsData: ProductsData = {
      products: data.data.items,
      total: data.data.total,
    };
    return productsData;
  } catch (error) {
    throw new Error(catchError(error));
  }
};

export const fetchProduct = async (id: string): Promise<ProductData> => {
  try {
    const url = `/products/${id}`;
    const { data } = await apiClient.get(url);
    if (!data.status) throw new Error(data.message);

    const productData: ProductData = {
      product: data.data,
    };
    return productData;
  } catch (error) {
    throw new Error(catchError(error));
  }
};

export const addProduct = async (product: Product): Promise<ProductData> => {
  try {
    const url = '/products/';
    const { data } = await apiClient.post(url, product);
    if (!data.status) throw new Error(data.message);
    return {
      product: data.data,
    };
  } catch (error) {
    throw new Error(catchError(error));
  }
};

export const additionalProduct = async (product: Product): Promise<ProductData> => {
  try {
    const url = `/products/${product.id}/add`;
    const { data } = await apiClient.post(url, product);
    if (!data.status) throw new Error(data.message);
    return {
      product: data.data,
    };
  } catch (error) {
    throw new Error(catchError(error));
  }
};

export const editProduct = async (product: Product): Promise<ProductData> => {
  try {
    const url = `/products/${product.id}`;
    const { data } = await apiClient.put(url, product);
    if (!data.status) throw new Error(data.message);
    return {
      product: data.data,
    };
  } catch (error) {
    throw new Error(catchError(error));
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  const url = `/products/${id}`;
  try {
    const { data } = await apiClient.delete(url);
    if (!data.status) throw new Error(data.message);
    return data.status;
  } catch (error) {
    throw new Error(catchError(error));
  }
};

export const ProductService = {
  fetchProducts,
  fetchProduct,
  editProduct,
  addProduct,
  deleteProduct,
  additionalProduct,
};
