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
    const student_id = uuid().toString().slice(0, 8);
    const teacher_id = uuid().toString().slice(0, 8);

    await this.userModel.create({
      id: student_id,
      name: student_name,
      role: 'student',
    });
    await studentWebhook.info(
      `[Init] Student created\nname: ${student_name}\nid: ${student_id}`,
    );

    await this.userModel.create({
      id: teacher_id,
      name: teacher_name,
      role: 'teacher',
    });
    await teacherWebhook.info(
      `[Init] Teacher created\nname: ${teacher_name}\nid: ${teacher_id}`,
    );

    const request_id = uuid();
    await this.requestModel.create({
      id: request_id,
      student_id: student_id,
      teacher_ids: [],
      created_at: new Date().toISOString(),
    });
    await studentWebhook.success(
      `[Step 1] Student's Request created\nid: ${request_id}`,
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
    if (found.length) {
      await teacherWebhook.success(`[Step 2] Teacher found requests`);
      let string = '';
      found.forEach((id) => {
        if (id == request_id) {
          string += `> ${id} (student's request)\n`;
        } else {
          string += `> ${id}\n`;
        }
      });
      await teacherWebhook.send(string);
    } else {
      await teacherWebhook.error('No requests found');
      return 'No requests found';
    }

    await this.requestModel.get({ id: request_id }).then(async (response) => {
      if (response) {
        response.teacher_ids.push(teacher_id);
        await this.requestModel.update(response).then(async () => {
          await teacherWebhook.success(`[Step 3] Teacher Joined request`);
          await teacherWebhook.send(`> ${request_id} (joined)`);

          await studentWebhook.success(`[Step 3] Student noticed update`);
          const requestJSON = JSON.stringify(response);
          await studentWebhook.send(`\`\`\`json\n${requestJSON}\n\`\`\``);

          await studentWebhook.warning(
            `[End] PLEASE TEACH ME ${teacher_name}!`,
          );
          await teacherWebhook.warning(`[End] I'LL TUTOR YOU ${student_name}!`);
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
