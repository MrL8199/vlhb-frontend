export type User = {
  id: string;
  avatar_url: string;
  user_name: string;
  phone?: string;
  email?: string;
  nickname: string;
  is_admin: boolean;
  created_at: number;
  updated_at: number;
};

export interface UserData {
  user: User;
}

export interface AddUserData {
  user: User;
}

export interface UsersData {
  users: User[];
  total: number;
}

export type UserFields = {
  username: string;
  password: string;
  nickname: string;
};
