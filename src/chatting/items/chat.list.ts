import { Question } from '../../question/entities/question.interface';
import { Chatting, ChattingStatus } from '../entities/chatting.interface';
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

export interface ChatRoom {
  status: ChattingStatus;
  id?: string;
  title: string;
  roomImage: string;
  opponentId?: string;
  isSelect: boolean;
  questionInfo?: Question;
  questionId: string;
  reservedStart?: Date;
}

export interface Message {
  sender: string;
  format: string;
  body: string;
  createdAt: string;
  isMyMsg?: boolean;
}
