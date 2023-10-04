export interface UserKey {
  id: string;
}

export interface User extends UserKey {
  bio?: string;
  coin: {
    amount: number;
    lastReceivedFreeCoinAt: Date;
  };
  createdAt?: string;
  followers: string[];
  following: string[];
  name: string;
  participatingChattingRooms: string[];
  profileImage?: string;
  role: string;
  school?: {
    level?: string;
    name?: string;
    division?: string;
    department?: string;
    grade?: number;
  };
}
