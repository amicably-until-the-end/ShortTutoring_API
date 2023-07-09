import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { Response, ResponseKey } from './entities/response.interface';

@Injectable()
export class ResponsesService {
  constructor(
    @InjectModel('Response')
    private responseModel: Model<Response, ResponseKey>,
  ) {}

  async create(response: {
    student_id: string;
    teacher_ids: any[];
    request_id: string;
  }) {
    return await this.responseModel.create(response);
  }

  async findOne(request_id: string) {
    return await this.responseModel.get({ request_id });
  }

  async update(request_id: string, teacher_id: string) {
    return await this.responseModel.get({ request_id }).then((response) => {
      response.teacher_ids.push(teacher_id);
      this.responseModel.update(response);
    });
  }

  async removeAll() {
    return await this.responseModel
      .scan()
      .exec()
      .then((responses) => {
        responses.forEach((response) => {
          this.responseModel.delete(response);
        });
      });
  }

  remove(id: number) {
    return `This action removes a #${id} response`;
  }

  async findAll() {
    return await this.responseModel.scan().exec();
  }
}
