import { QuestionRepository } from '../question/question.repository';
import { Fail, Success } from '../response';
import { UserRepository } from '../user/user.repository';
import { ChattingRepository } from './chatting.repository';
import { UpdateChattingDto } from './dto/update-chatting.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChattingService {
  constructor(
    private readonly chattingRepository: ChattingRepository,
    private readonly userRepository: UserRepository,
    private readonly questionRepository: QuestionRepository,
  ) {}

  async getChatList(userId: string) {
    try {
      const userInfo = await this.userRepository.get(userId);

      const chattingRoomIds = userInfo.participatingChattingRooms;

      const userRole = userInfo.role;

      const result = {
        normalProposed: undefined,
        normalReserved: [],
        selectedProposed: [],
        selectedReserved: [],
      };

      if (chattingRoomIds.length > 0) {
        const roomInfos = await this.chattingRepository.getChatRoomsInfo(
          chattingRoomIds.map((roomId) => {
            return {
              id: roomId,
            };
          }),
        );
        const roomInfosWithQuestion = await Promise.all(
          roomInfos?.map(async (roomInfo) => {
            const questionInfo = await this.questionRepository.getInfo(
              roomInfo.questionId,
            );
            const { status, isSelect } = questionInfo;
            const { schoolSubject, schoolLevel } = questionInfo.problem;

            const item = {
              roomImage: undefined,
              ...roomInfo,
              opponentId: undefined,
              questionState: status,
              isSelect: isSelect,
              schoolSubject: schoolSubject,
              schoolLevel: schoolLevel,
              title: undefined,
            };

            if (userRole == 'student') {
              const teacherInfo = await this.userRepository.get(
                roomInfo.teacherId,
              );
              const { profileImage, name } = teacherInfo;
              item.roomImage = profileImage;
              item.title = name;
              item.opponentId = teacherInfo.id;
            } else {
              const studentInfo = await this.userRepository.get(
                roomInfo.studentId,
              );
              const { profileImage, name } = studentInfo;
              item.roomImage = profileImage;
              item.title = name;
              item.opponentId = studentInfo.id;
            }

            return { ...roomInfo, questionInfo: questionInfo };
          }),
        );
        roomInfosWithQuestion.forEach((roomInfo) => {
          if (roomInfo.questionInfo.isSelect) {
            if (roomInfo.questionInfo.status === 'pending') {
              result.selectedProposed.push(roomInfo);
            } else if (roomInfo.questionInfo.status === 'reserved') {
              result.selectedReserved.push(roomInfo);
            }
          } else {
            if (roomInfo.questionInfo.status === 'pending') {
              if (userRole == 'student') {
                //grouping by questionId
                if (result.normalProposed == undefined) {
                  result.normalProposed = {};
                }
                if (result.normalProposed[roomInfo.questionId]) {
                  result.normalProposed[roomInfo.questionId].teachers.push(
                    roomInfo,
                  );
                } else {
                  result.normalProposed[roomInfo.questionId] = {
                    ...roomInfo.questionInfo,
                    teachers: [roomInfo],
                    questionImage: roomInfo.questionInfo.problem.mainImage,
                  };
                }
              } else {
                if (result.normalProposed == undefined) {
                  result.normalProposed = [];
                }
                result.normalProposed.push(roomInfo);
              }
            } else if (roomInfo.questionInfo.status === 'reserved') {
              result.normalReserved.push(roomInfo);
            }
          }
        });
      }
      if (result.normalProposed == undefined) {
        result.normalProposed = {};
      }
      const normalProposed = Object.values(result.normalProposed);
      if (normalProposed.length > 0) {
        result.normalProposed = normalProposed;
      }

      console.log(result);
      return new Success('채팅방 목록을 불러왔습니다.', result);
    } catch (error) {
      return new Fail(error.message);
    }
  }

  /*
  async create(senderId: string, createChattingDto: CreateChattingDto) {
    const receiverId = createChattingDto.roomId;
    const areConnected = await this.chattingRepository.areConnected(
      senderId,
      receiverId,
    );

    if (areConnected) {
      return new Fail('이미 채팅방이 존재합니다.');
    } else {
      return await this.chattingRepository.create(senderId, receiverId);
    }
  }

   */

  /*
    async sendMessage(senderId: string, roomId:string, sendMessageDto: SendMessageDto) {
      const receiverId = sendMessageDto.roomId;
      const areConnected = await this.chattingRepository.areConnected(
        senderId,
        receiverId,
      );

      if (areConnected) {
        return new Success(
          '성공적으로 메시지를 보냈습니다.',
          await this.chattingRepository.sendMessage(
            senderId,
            receiverId,
            sendMessageDto.message,
          ),
        );
      } else {
        return new Fail('채팅방이 존재하지 않습니다.');
      }
    }
    */

  async findAll() {
    return await this.chattingRepository.findAll();
  }

  async findOne(chattingRoomId: string) {
    return await this.chattingRepository.findOne(chattingRoomId);
  }

  update(id: number, updateChattingDto: UpdateChattingDto) {
    return `This action updates a #${id} chatting`;
  }

  remove(id: number) {
    return `This action removes a #${id} chatting`;
  }
}
