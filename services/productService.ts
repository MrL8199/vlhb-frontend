import { ProductData, ProductsData, Product } from 'types';
import { catchError } from 'utils/catchError';
import apiClient from 'utils/apiClient';
import { ParsedUrlQuery } from 'querystring';

type ProductPayload = { params: unknown };

const fetchProducts = async (params?: ParsedUrlQuery): Promise<ProductsData> => {
  try {
    const url = `/products`;
    const { data } = await apiClient.get(url, params);

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
    const url = '/products';
    const { data } = await apiClient.post(url, product);
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
    const { data } = await apiClient.post(url, product);
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
    return await apiClient.delete(url);
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
};
