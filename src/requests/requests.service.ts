import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { Request, RequestKey } from './entities/request.interface';

@Injectable()
export class RequestsService {
  constructor(
    @InjectModel('Request')
    private requestModel: Model<Request, RequestKey>,
  ) {}

  async create(request: Request) {
    return await this.requestModel.create(request);
  }

  async findAll() {
    return this.requestModel.scan().exec();
  }

  removeAll() {
    return this.requestModel
      .scan()
      .exec()
      .then((requests) => {
        requests.forEach((request) => {
          this.requestModel.delete(request);
        });
      });
  }

  remove(id: string) {
    return this.requestModel.delete({ id });
  }
}
