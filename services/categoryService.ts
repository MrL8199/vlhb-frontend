import { AddCategory, AddCategoryData, Category, CategoriesData } from 'types';
import { catchError } from 'utils/catchError';
import apiClient from 'utils/apiClient';

const getCategories = async (): Promise<CategoriesData> => {
  try {
    const { data } = await apiClient.get(`/category`);
    if (!data.status) throw new Error(data.message);

    const categoriesData: CategoriesData = {
      categories: data.data,
      total: data.data.length,
    };

    return categoriesData;
  } catch (error) {
    throw new Error(catchError(error));
  }
};

const addCategory = async (category: AddCategory): Promise<AddCategoryData> => {
  try {
    const url = '/category';
    const { data } = await apiClient.post(url, category);
    if (!data.status) throw new Error(data.message);
    return {
      category: data.data,
    };
  } catch (error) {
    throw new Error(catchError(error));
  }
};

const updateCategory = async (category: Category): Promise<AddCategoryData> => {
  try {
    const url = `/category/${category.id}`;
    const { data } = await apiClient.put(url, category);
    if (!data.status) throw new Error(data.message);
    return {
      category: data.data,
    };
  } catch (error) {
    throw new Error(catchError(error));
  }
};

const deleteCategory = async (id: string): Promise<void> => {
  const url = `/category/${id}`;
  try {
    const { data } = await apiClient.delete(url);
    if (!data.status) throw new Error(data.message);
    return data.status;
  } catch (error) {
    throw new Error(catchError(error));
  }
};

const fetchCategory = async (id: string): Promise<Category> => {
  try {
    const url = `/category/${id}`;
    const { data } = await apiClient.get(url);
    if (!data.status) throw new Error(data.message);

    const categoryData: Category = {
      id: data.data.id,
      name: data.data.name,
      created_at: data.data.created_at,
    };

    return categoryData;
  } catch (error) {
    throw new Error(catchError(error));
  }
};

export const CategoryService = {
  getCategories,
  updateCategory,
  deleteCategory,
  addCategory,
  fetchCategory,
};
