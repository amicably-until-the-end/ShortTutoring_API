import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { Request, RequestKey } from '../requests/entities/request.interface';

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
      const teacher = await this.userModel.get({ id: teacher_id });
      teachers.push(teacher);
    }
    return teachers;
  }

  async update(id: string, teacher_id: string) {
    await this.responseModel.get({ id }).then(async (request) => {
      if (request.teacher_ids.includes(teacher_id)) {
        return;
      }
      request.teacher_ids.push(teacher_id);
      await this.responseModel.update(request);
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
}
