export interface UserKey {
  id: string;
}

export interface User extends UserKey {
  role: string;
  name: string;
  bio?: string;
  profileImage?: string;
  createdAt?: string;
}
