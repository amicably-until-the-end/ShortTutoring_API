export interface UserKey {
  id: string;
}

export interface User extends UserKey {
  bio?: string;
  createdAt?: string;
  followers: string[];
  following: string[];
  name: string;
  profileImage?: string;
  role: string;
  school?: {
    level?: string;
    name?: string;
    division?: string;
    department?: string;
    grade: number;
  };
  participatingChattingRooms: {
    id: string;
    chatWith: string;
  }[];
}
