export interface AuthKey {
  vendor: string;
  authId: string;
}

export interface Auth extends AuthKey {
  userId: string;
  role: string;
}
