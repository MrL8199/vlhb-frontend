export type Category = {
  id: string;
  name: string;
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
