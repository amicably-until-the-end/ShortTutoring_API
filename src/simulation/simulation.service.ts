import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { User, UserKey } from '../user/entities/user.interface';
import { Request, RequestKey } from '../request/entities/request.interface';
import {
  studentWebhook,
  teacherWebhook,
  webhook,
} from '../config.discord-webhook';
import { v4 as uuid } from 'uuid';
import { ResponseService } from '../response/response.service';
import { Tutoring, TutoringKey } from '../tutoring/entities/tutoring.interface';

@Injectable()
export class SimulationService {
  constructor(
    @InjectModel('User')
    private userModel: Model<User, UserKey>,
    @InjectModel('Request')
    private requestModel: Model<Request, RequestKey>,
    @InjectModel('Tutoring')
    private tutoringModel: Model<Tutoring, TutoringKey>,
  ) {}

  async matching(studentName: string, teacherName: string) {
    const studentId = uuid().toString().slice(0, 8);
    const teacherId = uuid().toString().slice(0, 8);

    await this.userModel.create({
      id: studentId,
      name: studentName,
      role: 'student',
    });
    await studentWebhook.info(
      `[Init] Student created\nname: ${studentName}\nid: ${studentId}`,
    );

    await this.userModel.create({
      id: teacherId,
      name: teacherName,
      role: 'teacher',
    });
    await teacherWebhook.info(
      `[Init] Teacher created\nname: ${teacherName}\nid: ${teacherId}`,
    );

    const requestId = uuid();
    await this.requestModel.create({
      id: requestId,
      studentId: studentId,
      teacherIds: [],
      status: 'pending',
      problem: {
        description: 'test-problem',
      },
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
      await teacherWebhook.error('No request found');
      return 'No request found';
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

        await studentWebhook.warning(`[End] PLEASE TEACH ME ${teacherName}!`);
        await teacherWebhook.warning(`[End] I'LL TUTOR YOU ${studentName}!`);
        await webhook.success(`Matched ${studentName} and ${teacherName}`);
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
    string['user'] = await this.userModel.scan().exec();
    string['request'] = await this.requestModel.scan().exec();
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
          status: 'pending',
          id: 'test-request-id',
          studentId: 'test-student-id',
          teacherIds: ['test-teacher-id'],
          problem: { description: 'test-problem' },
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

  async onlyTest() {
    await this.removeAll().then(async () => {
      await this.createTest();
    });

    return await this.getAll();
  }

  async selecting(studentName: string, n: number) {
    const studentId = 'S_' + uuid().toString().slice(0, 4);
    await this.userModel.create({
      id: studentId,
      name: studentName,
      role: 'student',
    });

    const teachers = [];
    for (let i = 0; i < n; i++) {
      const uid = uuid().toString().slice(0, 4);
      const teacher = {
        id: 'T_' + uid,
        name: 'teacher_' + uid,
        role: 'teacher',
      };

      await this.userModel.create(teacher);
      teachers.push(teacher);
    }

    const requestId = 'R_' + uuid().toString().slice(0, 4);
    await this.requestModel.create({
      id: requestId,
      studentId: studentId,
      problem: {
        description: 'test-problem-description',
      },
      status: 'pending',
      teacherIds: [],
    });
    console.log(await this.getAll());

    const responseService = new ResponseService(
      this.userModel,
      this.requestModel,
      this.tutoringModel,
    );
    for (const teacher of teachers) {
      await responseService.create(requestId, teacher.id);
    }
    console.log(await this.getAll());

    await responseService.select({
      requestId,
      studentId,
      teacherId: teachers[0].id,
    });

    return await this.getAll();
  }
}
