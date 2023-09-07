export interface ChattingKey {
  id: string;
}

export interface Chat {
  sender: string;
  message: string;
  createdAt: string;
}

export interface Chatting extends ChattingKey {
  participants: string[];
  logs: Chat[];
}
