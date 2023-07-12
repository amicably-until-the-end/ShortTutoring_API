import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { User, UserKey } from '../user/entities/user.interface';
import { Request, RequestKey } from '../request/entities/request.interface';
import { Tutoring, TutoringKey } from '../tutoring/entities/tutoring.interface';
import { SelectResponseDto } from './dto/create-response.dto';
import { TutoringService } from '../tutoring/tutoring.service';

@Injectable()
export class ResponseService {
  constructor(
    @InjectModel('User')
    private userModel: Model<User, UserKey>,
    @InjectModel('Request')
    private requestModel: Model<Request, RequestKey>,
    @InjectModel('Tutoring')
    private tutoringModel: Model<Tutoring, TutoringKey>,
  ) {}

  async findOne(id: string) {
    const request = await this.requestModel.get({ id });
    const teachers = [];
    for (const teacherId of request.teacherIds) {
      teachers.push(await this.userModel.get({ id: teacherId }));
    }
    return teachers;
  }

  async update(id: string, teacherId: string) {
    await this.requestModel.get({ id }).then(async (response) => {
      if (response.teacherIds.includes(teacherId)) {
        throw new HttpException('Already selected', 304);
      } else {
        response.teacherIds.push(teacherId);
        await this.requestModel.update(response);
      }
    });
    return await this.requestModel.get({ id });
  }

  async remove(id: string, teacherId: string) {
    return await this.requestModel.get({ id }).then((response) => {
      response.teacherIds = response.teacherIds.filter(
        (id) => id !== teacherId,
      );
      this.requestModel.update(response);
    });
  }

  async select(selectResponseDto: SelectResponseDto) {
    let tutoring;
    await this.requestModel
      .get({ id: selectResponseDto.requestId })
      .then(async (response) => {
        response.teacherIds = response.teacherIds.filter(
          (id) => id === selectResponseDto.teacherId,
        );

        const tutoringService = new TutoringService(this.tutoringModel);
        tutoring = await tutoringService.create(selectResponseDto);

        response.status = 'selected';
        response.tutoringId = tutoring.id;
        await this.requestModel.update(response);
      });

    return {
      message: 'Selected',
      error: false,
      data: {
        tutoring,
      },
    };
  }

  async check(id: string, teacherId: string) {
    let request;
    try {
      request = await this.requestModel.get({ id });
    } catch (e) {
      throw new HttpException('Not found', 404);
    }
    if (request.status === 'pending') {
      throw new HttpException('Yet selected', 200);
    } else if (request.status === 'selected') {
      const tutoring = await this.tutoringModel.get({
        id: request.tutoringId,
      });

      if (tutoring.teacherId !== teacherId) {
        throw new HttpException('Not selected', 200);
      }

      return {
        message: 'Selected',
        error: false,
        data: {
          tutoring,
        },
      };
    }
  }
}
