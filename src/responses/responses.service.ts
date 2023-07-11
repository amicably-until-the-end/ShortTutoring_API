import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { PostSelectDto } from './dto/select-response.dto';
import { User, UserKey } from '../users/entities/user.interface';
import { Request, RequestKey } from '../requests/entities/request.interface';
import {
  Tutoring,
  TutoringKey,
} from '../tutorings/entities/tutoring.interface';
import { TutoringsService } from '../tutorings/tutorings.service';

@Injectable()
export class ResponsesService {
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
    for (const teacher_id of request.teacher_ids) {
      teachers.push(await this.userModel.get({ id: teacher_id }));
    }
    return teachers;
  }

  async update(id: string, teacher_id: string) {
    await this.requestModel.get({ id }).then(async (response) => {
      if (response.teacher_ids.includes(teacher_id)) {
        throw new HttpException('Already selected', 409);
      } else {
        response.teacher_ids.push(teacher_id);
        await this.requestModel.update(response);
      }
    });
    return await this.requestModel.get({ id });
  }

  async remove(id: string, teacher_id: string) {
    return await this.requestModel.get({ id }).then((response) => {
      response.teacher_ids = response.teacher_ids.filter(
        (id) => id !== teacher_id,
      );
      this.requestModel.update(response);
    });
  }

  async select(postSelectDto: PostSelectDto) {
    let tutoring;
    await this.requestModel
      .get({ id: postSelectDto.request_id })
      .then(async (response) => {
        response.teacher_ids = response.teacher_ids.filter(
          (id) => id === postSelectDto.teacher_id,
        );

        const tutoringService = new TutoringsService(this.tutoringModel);
        tutoring = await tutoringService.create(postSelectDto);

        response.status = 'selected';
        response.tutoring_id = tutoring.id;
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

  async check(id: string, teacher_id: string) {
    let request;
    try {
      request = await this.requestModel.get({ id });
    } catch (e) {
      throw new HttpException('Not found', 404);
    }
    if (request.status === 'pending') {
      throw new HttpException('Yet selected', 201);
    } else if (request.status === 'selected') {
      const tutoring = await this.tutoringModel.get({
        id: request.tutoring_id,
      });

      if (tutoring.teacher_id !== teacher_id) {
        throw new HttpException('Not selected', 202);
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
