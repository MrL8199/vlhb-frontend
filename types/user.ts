export type User = {
  _id: string;
  username: string;
  phone?: string;
  email?: string;
  nickname: string;
  role: 'user' | 'admin';
};

export type UserFields = {
  username: string;
  password: string;
  nickname: string;
};
