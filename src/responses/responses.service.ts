import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { Request, RequestKey } from '../requests/entities/request.interface';
import { PostSelectDto } from './dto/select-response.dto';

@Injectable()
export class ResponsesService {
  constructor(
    @InjectModel('User')
    private userModel: Model<Request, RequestKey>,
    @InjectModel('Request')
    private responseModel: Model<Request, RequestKey>,
  ) {}

  async findOne(id: string) {
    const request = await this.responseModel.get({ id });
    const teachers = [];
    for (const teacher_id of request.teacher_ids) {
      teachers.push(await this.userModel.get({ id: teacher_id }));
    }
    return teachers;
  }

  async update(id: string, teacher_id: string) {
    await this.responseModel.get({ id }).then(async (response) => {
      if (response.teacher_ids.includes(teacher_id)) {
        throw new HttpException('Already selected', 409);
      } else {
        response.teacher_ids.push(teacher_id);
        await this.responseModel.update(response);
      }
    });
    return await this.responseModel.get({ id });
  }

  async remove(id: string, teacher_id: string) {
    return await this.responseModel.get({ id }).then((response) => {
      response.teacher_ids = response.teacher_ids.filter(
        (id) => id !== teacher_id,
      );
      this.responseModel.update(response);
    });
  }

  async select(postCreateDto: PostSelectDto) {
    await this.responseModel
      .get({ id: postCreateDto.request_id })
      .then(async (response) => {
        response.teacher_ids = response.teacher_ids.filter(
          (id) => id === postCreateDto.teacher_id,
        );
        await this.responseModel.update(response);
      });

    return await this.responseModel.get({ id: postCreateDto.request_id });
  }
}
