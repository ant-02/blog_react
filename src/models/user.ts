export type UserDTO = {
  id: number;
  username: string;
  avatar: string;
};

export type User = {
  id: number;
  username: string;
  phone: string;
  avatar: string;
  email: string;
  password: string;
  bio: string;
  createdAt: string;
  deletedAt: string;
  updatedAt: string;
};

export type LoginResponse = {
  token: string;
  user: User;
};
