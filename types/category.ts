export type Category = {
  id: string;
  name: string;
  created_at: number;
};

export interface AddCategory {
  name: string;
}

export interface CategoriesData {
  categories: Category[];
  total: number;
}

export interface AddCategoryData {
  category: Category;
}
