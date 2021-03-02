import { ProductData, ProductsData, AddProduct, AddProductData } from 'types';
import { catchError } from 'utils/catchError';
import apiClient from 'utils/apiClient';

type ProductPayload = { params: unknown };

const fetchProducts = async (payload?: ProductPayload): Promise<ProductsData> => {
  try {
    const url = `/products`;
    const { data } = await apiClient.get(url, payload);

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
    const relatedProductsData = await apiClient.get(`/products?category=${data.data.category.id}`);

    const productData: ProductData = {
      product: data.data,
      relatedProducts: relatedProductsData.data.items,
    };
    return productData;
  } catch (error) {
    throw new Error(catchError(error));
  }
};

export const addProduct = async (product: AddProduct): Promise<AddProductData> => {
  try {
    const url = '/products';
    const { data } = await apiClient.post(url, product);
    return {
      product: data.data.product,
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
  addProduct,
  deleteProduct,
};
