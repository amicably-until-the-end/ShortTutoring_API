export interface ChattingKey {
  id: string;
}

export interface Chatting extends ChattingKey {
  participants: string[];
  logs: [
    {
      sender: string;
      message: string;
      createdAt: string;
    },
  ];
}
