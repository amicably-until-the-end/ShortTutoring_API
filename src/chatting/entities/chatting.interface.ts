export interface ChattingKey {
  id: string;
}

export interface Message {
  sender: string;
  format: string;
  body?: string;
  createdAt: string;
}

export interface Chatting extends ChattingKey {
  studentId: string;
  teacherId: string;
  questionId: string;
  messages: Message[];
}
