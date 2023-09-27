import { Question } from '../../question/entities/question.interface';
import { Chatting } from '../entities/chatting.interface';
import { Item } from 'nestjs-dynamoose';

export interface ChatList {
  normalProposed: ChatRoom[];
  normalReserved: ChatRoom[];
  selectedProposed: ChatRoom[];
  selectedReserved: ChatRoom[];
}

export interface NestedChatRoomInfo {
  roomInfo: Item<Chatting>;
  questionInfo: Item<Question>;
}

export enum ChattingStatus {
  pending = 'pending',
  reserved = 'reserved',
}

export interface ChatRoom {
  status: ChattingStatus;
  messages?: Message[];
  id?: string;
  title: string;
  roomImage: string;
  opponentId?: string;
  isSelect: boolean;
  questionInfo?: Question;
  questionId: string;
}

export interface Message {
  sender: string;
  format: string;
  body: string;
  createdAt: string;
  isMyMsg?: boolean;
}
