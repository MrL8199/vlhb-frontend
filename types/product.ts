import { Author } from './author';
import { Category } from './category';
import { Publisher } from './publisher';

export type Product = {
  id: string;
  created_at: number;
  updated_at: number;
  title: string;
  price: number;
  publish_year: number;
  page_number: number;
  quantity: number;
  quotes_about: string;
  discount: number;
  start_at: number;
  end_at: number;
  author: Author;
  publisher: Publisher;
  category: Category;
  images: ImageProduct[];
};

interface ImageProduct {
  id: string;
  url: string;
}

export interface ProductsData {
  products: Product[];
  total: number;
}

export interface ProductData {
  product: Product;
}

export interface AddProductData {
  product: Product;
}

export type Products = Product[];
