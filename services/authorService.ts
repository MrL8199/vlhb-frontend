import { AddAuthor, AddAuthorData, Author, AuthorsData } from 'types';
import { catchError } from 'utils/catchError';
import apiClient from 'utils/apiClient';

const getAuthors = async (): Promise<AuthorsData> => {
  try {
    const { data } = await apiClient.get(`/authors`);
    if (!data.status) throw new Error(data.message);

    const authorsData: AuthorsData = {
      authors: data.data,
      total: data.data.length,
    };

    return authorsData;
  } catch (error) {
    throw new Error(catchError(error));
  }
};

const addAuthor = async (category: AddAuthor): Promise<AddAuthorData> => {
  try {
    const url = '/authors';
    const { data } = await apiClient.post(url, category);
    if (!data.status) throw new Error(data.message);
    return {
      author: data.data,
    };
  } catch (error) {
    throw new Error(catchError(error));
  }
};

const updateAuthor = async (category: Author): Promise<AddAuthorData> => {
  try {
    const url = `/authors/${category.id}`;
    const { data } = await apiClient.put(url, category);
    if (!data.status) throw new Error(data.message);
    return {
      author: data.data,
    };
  } catch (error) {
    throw new Error(catchError(error));
  }
};

const deleteAuthor = async (id: string): Promise<void> => {
  const url = `/authors/${id}`;
  try {
    const { data } = await apiClient.delete(url);
    if (!data.status) throw new Error(data.message);
    return data.status;
  } catch (error) {
    throw new Error(catchError(error));
  }
};

const fetchAuthor = async (id: string): Promise<Author> => {
  try {
    const url = `/authors/${id}`;
    const { data } = await apiClient.get(url);
    if (!data.status) throw new Error(data.message);

    const authorData: Author = {
      id: data.data.id,
      name: data.data.name,
      info: data.data.info,
      picture: data.data.picture,
      created_at: data.data.created_at,
    };

    return authorData;
  } catch (error) {
    throw new Error(catchError(error));
  }
};

export const AuthorService = {
  getAuthors,
  updateAuthor,
  deleteAuthor,
  addAuthor,
  fetchAuthor,
};
