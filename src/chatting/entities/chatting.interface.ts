export interface ChattingKey {
  id: string;
}

export interface Message {
  sender: string;
  format: string;
  body: string | null;
  createdAt: string;
}

export interface Chatting extends ChattingKey {
  studentId: string;
  teacherId: string;
  questionId: string;
  messages: Message[];
  status: ChattingStatus;
}

export enum ChattingStatus {
  proposed = 'pending',
  reserved = 'reserved',
  completed = 'completed',
  declined = 'declined',
}
