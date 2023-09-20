export interface ChattingKey {
  id: string;
}

export interface Message {
  type: string;
  body: string;
}

export interface Chat {
  sender: string;
  message: Message;
  createdAt: string;
}

export interface Chatting extends ChattingKey {
  studentId: string;
  teacherId: string;
  questionId: string;
  messages: Chat[];
}
