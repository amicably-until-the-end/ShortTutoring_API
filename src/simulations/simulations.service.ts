import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { User, UserKey } from '../users/entities/user.interface';
import { Request, RequestKey } from '../requests/entities/request.interface';
import {
  Response,
  ResponseKey,
} from '../responses/entities/response.interface';
import { studentWebhook, teacherWebhook } from '../config.discord-webhook';

@Injectable()
export class SimulationsService {
  constructor(
    @InjectModel('User')
    private userModel: Model<User, UserKey>,
    @InjectModel('Request')
    private requestModel: Model<Request, RequestKey>,
    @InjectModel('Response')
    private responseModel: Model<Response, ResponseKey>,
  ) {}

  async matching(student_name: string, teacher_name: string) {
    const student_id = uuid();
    const teacher_id = uuid();

    await this.userModel
      .create({
        id: student_id,
        name: student_name,
        role: 'student',
      })
      .then(
        async () =>
          await studentWebhook.info(`Student ${student_name} created`),
      );
    await this.userModel
      .create({
        id: teacher_id,
        name: teacher_name,
        role: 'teacher',
      })
      .then(
        async () =>
          await teacherWebhook.info(`Teacher ${teacher_name} created`),
      );

    const request_id = uuid();
    await this.requestModel
      .create({
        id: request_id,
        student_id: student_id,
      })
      .then(async (r) => await studentWebhook.info(`Request ${r.id} created`));

    await this.responseModel
      .create({
        request_id: request_id,
        student_id: student_id,
        teacher_ids: [],
      })
      .then(
        async () => await studentWebhook.info(`Response ${request_id} created`),
      );

    const found = [];
    await this.requestModel
      .scan()
      .exec()
      .then((requests) => {
        requests.forEach((request) => {
          found.push(request.id);
        });
      });
    if (found.length) await teacherWebhook.success(`Found requests: ${found}`);
    else {
      await teacherWebhook.error('No requests found');
      return 'No requests found';
    }

    await this.responseModel
      .get({ request_id: request_id })
      .then(async (response) => {
        if (response) {
          response.teacher_ids.push(teacher_id);
          await this.responseModel.update(response).then(async () => {
            await teacherWebhook.success(`Joined request ${request_id}`);
            await studentWebhook.success(`Response ${request_id} updated`);
          });
        } else {
          await teacherWebhook.error(`Request ${request_id} not found`);
          return 'Request not found';
        }
      });

    await this.responseModel
      .get({ request_id: request_id })
      .then(async (request) => {
        if (request.teacher_ids.length > 0) {
          await studentWebhook.success(
            `Please Teach me ${request.teacher_ids[0]}!`,
          );
          await teacherWebhook.success(`Let's teach ${teacher_name}!`);
        } else {
          await studentWebhook.error(`No teacher found`);
          return 'No teacher found';
        }
      });

    return 'Matching done';
  }

  removeAll() {
    this.userModel
      .scan()
      .exec()
      .then((users) => {
        users.forEach((user) => {
          this.userModel.delete(user);
        });
      });
    this.requestModel
      .scan()
      .exec()
      .then((requests) => {
        requests.forEach((request) => {
          this.requestModel.delete(request);
        });
      });
    this.responseModel
      .scan()
      .exec()
      .then((responses) => {
        responses.forEach((response) => {
          this.responseModel.delete(response);
        });
      });
    return 'All removed';
  }
}
