import { Question } from '../../question/entities/question.interface';
import { Chatting, Message } from '../entities/chatting.interface';
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
  problemImage?: string;
  opponentId?: string;
  schoolSubject: string;
  schoolLevel: string;
  isSelect: boolean;
  isTeacherRoom: boolean;
  questionInfo?: Question;
  teachers?: ChatRoom[];
  questionId: string;
}
