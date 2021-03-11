export type Author = {
  id: string;
  name: string;
  picture: string;
  info: string;
  created_at: number;
};

export interface AddAuthor {
  name: string;
  info: string;
  picture: string;
}

export interface AuthorsData {
  authors: Author[];
  total: number;
}

export interface AddAuthorData {
  author: Author;
}
