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

      const chattingRoomIds = userInfo.participatingChattingRooms.map(
        (roomId) => {
          return { id: roomId };
        },
      );

      const userRole = userInfo.role;

      const result = {
        normalProposed: [],
        normalReserved: [],
        selectedProposed: [],
        selectedReserved: [],
      };

      const normalProposedGrouping = {};

      if (chattingRoomIds.length > 0) {
        const roomInfos = await this.chattingRepository.getChatRoomsInfo(
          chattingRoomIds,
        );
        const roomInfosWithQuestion = await Promise.all(
          roomInfos?.map(async (roomInfo) => {
            const questionInfo = await this.questionRepository.getInfo(
              roomInfo.questionId,
            );
            console.log(questionInfo);
            const { status, isSelect } = questionInfo;
            const { schoolSubject, schoolLevel, description } =
              questionInfo.problem;

            const item = {
              roomImage: undefined,
              id: roomInfo.id,
              messages: roomInfo.messages.map((message) => {
                const { body, ...rest } = message;
                return { body: JSON.parse(body), ...rest };
              }),
              opponentId: undefined,
              questionState: status,
              problemImages: questionInfo.problem.mainImage,
              isSelect: isSelect,
              questionId: roomInfo.questionId,
              schoolSubject: schoolSubject,
              schoolLevel: schoolLevel,
              title: undefined,
              status: status,
              description: description,
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

            return item;
          }),
        );

        roomInfosWithQuestion.forEach((roomInfo) => {
          if (roomInfo.isSelect) {
            if (roomInfo.status === 'pending') {
              result.selectedProposed.push(roomInfo);
            } else if (roomInfo.status === 'reserved') {
              result.selectedReserved.push(roomInfo);
            }
          } else {
            if (roomInfo.status === 'pending') {
              if (userRole == 'student') {
                //grouping by questionId
                if (normalProposedGrouping[roomInfo.questionId]) {
                  normalProposedGrouping[roomInfo.questionId].teachers.push(
                    roomInfo,
                  );
                } else {
                  normalProposedGrouping[roomInfo.questionId] = {
                    teachers: [roomInfo],
                    questionImage: roomInfo.problemImages,
                    title: roomInfo.description,
                    subject: roomInfo.schoolSubject,
                  };
                }
              } else {
                result.normalProposed.push(roomInfo);
              }
            } else {
              result.normalReserved.push(roomInfo);
            }
          }
        });
      }
      if (Object.keys(normalProposedGrouping).length > 0) {
        result.normalProposed = Object.values(normalProposedGrouping);
      }
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
