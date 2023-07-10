import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { User, UserKey } from '../users/entities/user.interface';
import { Request, RequestKey } from '../requests/entities/request.interface';
import {
  studentWebhook,
  teacherWebhook,
  webhook,
} from '../config.discord-webhook';

@Injectable()
export class SimulationsService {
  constructor(
    @InjectModel('User')
    private userModel: Model<User, UserKey>,
    @InjectModel('Request')
    private requestModel: Model<Request, RequestKey>,
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
        teacher_ids: [],
      })
      .then(async (r) => await studentWebhook.info(`Request ${r.id} created`));

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

    await this.requestModel.get({ id: request_id }).then(async (response) => {
      if (response) {
        response.teacher_ids.push(teacher_id);
        await this.requestModel.update(response).then(async () => {
          await teacherWebhook.success(`Joined request ${request_id}`);
          await studentWebhook.success(`Request ${request_id} updated`);
          await studentWebhook.success(`PLEASE TEACH ME ${teacher_name}!`);
          await teacherWebhook.success(`I'LL TUTOR YOU ${student_name}!`);
          await webhook.success(`Matched ${student_name} and ${teacher_name}`);
        });
      } else {
        await teacherWebhook.error(`Request ${request_id} not found`);
        await webhook.error(`Match failed`);
        return 'Request not found';
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
          return this.userModel.delete(user);
        });
      });
    this.requestModel
      .scan()
      .exec()
      .then((requests) => {
        requests.forEach((request) => {
          return this.requestModel.delete(request);
        });
      });
    return 'All removed';
  }
}
