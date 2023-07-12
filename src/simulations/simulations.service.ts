import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { User, UserKey } from '../users/entities/user.interface';
import { Request, RequestKey } from '../requests/entities/request.interface';
import {
  studentWebhook,
  teacherWebhook,
  webhook,
} from '../config.discord-webhook';
import { v4 as uuid } from 'uuid';

@Injectable()
export class SimulationsService {
  constructor(
    @InjectModel('User')
    private userModel: Model<User, UserKey>,
    @InjectModel('Request')
    private requestModel: Model<Request, RequestKey>,
  ) {}

  async matching(student_name: string, teacher_name: string) {
    const studentId = uuid().toString().slice(0, 8);
    const teacherId = uuid().toString().slice(0, 8);

    await this.userModel.create({
      id: studentId,
      name: student_name,
      role: 'student',
    });
    await studentWebhook.info(
      `[Init] Student created\nname: ${student_name}\nid: ${studentId}`,
    );

    await this.userModel.create({
      id: teacherId,
      name: teacher_name,
      role: 'teacher',
    });
    await teacherWebhook.info(
      `[Init] Teacher created\nname: ${teacher_name}\nid: ${teacherId}`,
    );

    const requestId = uuid();
    await this.requestModel.create({
      id: requestId,
      studentId: studentId,
      teacherIds: [],
      createdAt: new Date().toISOString(),
    });
    await studentWebhook.success(
      `[Step 1] Student's Request created\nid: ${requestId}`,
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
        if (id == requestId) {
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

    await this.requestModel.get({ id: requestId }).then(async (response) => {
      if (response) {
        response.teacherIds.push(teacherId);
        await this.requestModel.update(response);

        await teacherWebhook.success(`[Step 3] Teacher Joined request`);
        await teacherWebhook.send(`> ${requestId} (joined)`);

        await studentWebhook.success(`[Step 3] Student noticed update`);
        const requestJSON = JSON.stringify(response);
        await studentWebhook.send(`\`\`\`json\n${requestJSON}\n\`\`\``);

        await studentWebhook.warning(`[End] PLEASE TEACH ME ${teacher_name}!`);
        await teacherWebhook.warning(`[End] I'LL TUTOR YOU ${student_name}!`);
        await webhook.success(`Matched ${student_name} and ${teacher_name}`);
      } else {
        await teacherWebhook.error(`Request ${requestId} not found`);
        await webhook.error(`Match failed`);
        return 'Request not found';
      }
    });

    return this.getAll();
  }

  async removeAll() {
    await this.userModel
      .scan()
      .exec()
      .then((users) => {
        users.forEach((user) => {
          return this.userModel.delete(user);
        });
      });
    await this.requestModel
      .scan()
      .exec()
      .then((requests) => {
        requests.forEach((request) => {
          return this.requestModel.delete(request);
        });
      });
    return await this.getAll();
  }

  async getAll() {
    const string = {};
    string['users'] = await this.userModel.scan().exec();
    string['requests'] = await this.requestModel.scan().exec();
    return string;
  }

  async createTest() {
    try {
      await this.userModel.create({
        id: 'test-student-id',
        name: 'test-student-name',
        role: 'student',
      });
      await this.userModel.create({
        id: 'test-teacher-id',
        name: 'test-teacher-name',
        role: 'teacher',
      });
      await this.requestModel
        .create({
          id: 'test-request-id',
          studentId: 'test-student-id',
          teacherIds: ['test-teacher-id'],
          createdAt: new Date().toISOString(),
        })
        .then(async (response) => {
          await this.requestModel.update(response);
        });
    } catch (e) {
      return this.getAll();
    }
    return this.getAll();
  }
}
