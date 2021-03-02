import { AddCategory, AddCategoryData, Category, CategoriesData } from 'types';
import { catchError } from 'utils/catchError';
import apiClient from 'utils/apiClient';

const getCategories = async (): Promise<CategoriesData> => {
  try {
    const { data } = await apiClient.get(`/category`);

    const categoriesData: CategoriesData = {
      categories: data.data.items,
      total: data.data.total,
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
    return await apiClient.delete(url);
  } catch (error) {
    throw new Error(catchError(error));
  }
};

const fetchCategory = async (id: string): Promise<Category> => {
  try {
    const url = `/category/${id}`;
    const { data } = await apiClient.get(url);

    const categoryData: Category = {
      id: data.data.id,
      name: data.data.name,
    };

    return categoryData;
  } catch (error) {
    throw new Error(catchError(error));
  }
};

export const CategoryService = {
  getCategories,
  deleteCategory,
  addCategory,
  fetchCategory,
};
