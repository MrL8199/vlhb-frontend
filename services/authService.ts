import { User } from 'types';
import { catchError } from 'utils/catchError';
import { setAuthToken } from 'utils/auth';
import apiClient from 'utils/apiClient';

interface UserData {
  user: User;
  token: string;
}

interface UserPasswordData {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

interface UserFields {
  name: string;
  email: string;
  image: string | ArrayBuffer | null;
}

const getMe = async (token: string): Promise<UserData> => {
  setAuthToken(token);
  try {
    const { data } = await apiClient.get(`/auth/me`);

    const userData: UserData = {
      token: data.data.access_token,
      user: data.data,
    };

    return userData;
  } catch (error) {
    throw new Error(catchError(error));
  }
};

const verifyGoogleIdToken = async (idToken: string): Promise<UserData> => {
  try {
    const url = `/auth/google`;
    const { data } = await apiClient.post(url, { idToken });
    const userData: UserData = {
      user: data.data.user,
      token: data.data.token,
    };
    return userData;
  } catch (error) {
    throw new Error(catchError(error));
  }
};

const login = async (username: string, password: string): Promise<UserData> => {
  try {
    const url = `/auth/login`;
    const { data } = await apiClient.post(url, { username, password });
    if (!data.status) {
      throw new Error(catchError(data));
    }
    const userData: UserData = {
      token: data.data.access_token,
      user: data.data,
    };
    return userData;
  } catch (error) {
    throw new Error(catchError(error));
  }
};

const signUp = async ({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}): Promise<UserData> => {
  try {
    const url = `/auth/signUp`;
    const { data } = await apiClient.post(url, { email, password, name });
    if (!data.status) {
      throw new Error(catchError(data));
    }
    const userData: UserData = {
      user: data.data.user,
      token: data.data.token,
    };
    return userData;
  } catch (error) {
    throw new Error(catchError(error));
  }
};

export const changePassword = async (passwordFields: UserPasswordData): Promise<UserData> => {
  try {
    const url = `/auth/change-password`;
    const { data } = await apiClient.patch(url, passwordFields);
    if (!data.status) {
      throw new Error(catchError(data));
    }
    const userData: UserData = {
      user: data.data.user,
      token: data.data.token,
    };
    return userData;
  } catch (error) {
    throw new Error(catchError(error));
  }
};

export const updateProfile = async (
  userId: string,
  userFields: UserFields
): Promise<{ user: User }> => {
  try {
    const url = `/users/${userId}`;
    const { data } = await apiClient.patch(url, userFields, {
      params: { id: userId },
    });
    if (!data.status) {
      throw new Error(catchError(data));
    }

    const userData: { user: User } = {
      user: data.data.user,
    };

    return userData;
  } catch (error) {
    throw new Error(catchError(error));
  }
};

const logout = async (token: string): Promise<{ success: boolean }> => {
  setAuthToken(token);
  try {
    const url = `/auth/logout`;
    const { data } = await apiClient.delete(url);
    if (!data.status) {
      throw new Error(catchError(data));
    }
    return { success: true };
  } catch (error) {
    throw new Error(catchError(error));
  }
};

export const AuthService = {
  getMe,
  login,
  signUp,
  verifyGoogleIdToken,
  changePassword,
  updateProfile,
  logout,
};
