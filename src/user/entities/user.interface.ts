export interface UserKey {
  id: string;
}

export interface User extends UserKey {
  name: string;
  bio?: string;
  profileImage?: string;
  role?: string;
  createdAt?: string;
}
