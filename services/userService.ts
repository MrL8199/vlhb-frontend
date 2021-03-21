import { AddUserData, User, UserData, UsersData } from 'types';
import { catchError } from 'utils/catchError';
import apiClient from 'utils/apiClient';

const getUsers = async (): Promise<UsersData> => {
  try {
    const { data } = await apiClient.get(`/user`);
    if (!data.status) throw new Error(data.message);

    const usersData: UsersData = {
      users: data.data,
      total: data.data.length,
    };

    return usersData;
  } catch (error) {
    throw new Error(catchError(error));
  }
};

const addUser = async (user: AddUserData): Promise<AddUserData> => {
  try {
    const url = '/user';
    const { data } = await apiClient.post(url, user);
    if (!data.status) throw new Error(data.message);
    return {
      user: data.data,
    };
  } catch (error) {
    throw new Error(catchError(error));
  }
};

const updateUser = async (user: User): Promise<AddUserData> => {
  try {
    const url = `/user/${user.id}`;
    const { data } = await apiClient.put(url, user);
    if (!data.status) throw new Error(data.message);
    return {
      user: data.data,
    };
  } catch (error) {
    throw new Error(catchError(error));
  }
};

const deleteUser = async (id: string): Promise<void> => {
  const url = `/user/${id}`;
  try {
    const { data } = await apiClient.delete(url);
    if (!data.status) throw new Error(data.message);
    return data.status;
  } catch (error) {
    throw new Error(catchError(error));
  }
};

const fetchUser = async (id: string): Promise<UserData> => {
  try {
    const url = `/user/${id}`;
    const { data } = await apiClient.get(url);
    if (!data.status) throw new Error(data.message);

    const userData: UserData = {
      user: data.data,
    };

    return userData;
  } catch (error) {
    throw new Error(catchError(error));
  }
};

export const UserService = {
  getUsers,
  updateUser,
  deleteUser,
  addUser,
  fetchUser,
};
