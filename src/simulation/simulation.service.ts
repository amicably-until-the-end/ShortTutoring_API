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
import { MessageBuilder } from 'discord-webhook-node';

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
      bio: 'test-student',
      name: studentName,
      role: 'student',
      profileImage:
        'https://short-tutoring.s3.ap-northeast-2.amazonaws.com/default/profile.png',
      createdAt: new Date().toISOString(),
    });
    await studentWebhook.info(
      `[Init] Student created\nname: ${studentName}\nid: ${studentId}`,
    );

    await this.userModel.create({
      id: teacherId,
      bio: 'test-teacher',
      name: teacherName,
      role: 'teacher',
      profileImage:
        'https://short-tutoring.s3.ap-northeast-2.amazonaws.com/default/profile.png',
      createdAt: new Date().toISOString(),
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

  async getAll() {
    const string = {};
    string['user'] = await this.userModel.scan().exec();
    string['request'] = await this.requestModel.scan().exec();
    string['tutoring'] = await this.tutoringModel.scan().exec();
    return string;
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
    await this.tutoringModel
      .scan()
      .exec()
      .then((tutorings) => {
        tutorings.forEach((tutoring) => {
          return this.tutoringModel.delete(tutoring);
        });
      });
    return await this.getAll();
  }

  async createTest() {
    try {
      await this.userModel.create({
        id: 'test-student-id',
        bio: 'test-student',
        name: 'test-student-name',
        role: 'student',
        profileImage:
          'https://short-tutoring.s3.ap-northeast-2.amazonaws.com/default/profile.png',
        createdAt: new Date().toISOString(),
      });
      await this.userModel.create({
        id: 'test-teacher-id',
        bio: 'test-teacher',
        name: 'test-teacher-name',
        role: 'teacher',
        profileImage:
          'https://short-tutoring.s3.ap-northeast-2.amazonaws.com/default/profile.png',
        createdAt: new Date().toISOString(),
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
      bio: 'test-student',
      name: studentName,
      role: 'student',
      profileImage:
        'https://short-tutoring.s3.ap-northeast-2.amazonaws.com/default/profile.png',
      createdAt: new Date().toISOString(),
    });
    const embedStudent = new MessageBuilder()
      .setTitle('학생 생성')
      .setColor(Number('#00ff00'))
      .addField('이름', studentName)
      .addField('ID  ', studentId)
      .setImage(
        'https://short-tutoring.s3.ap-northeast-2.amazonaws.com/default/profile.png',
      );
    await studentWebhook.send(embedStudent);

    const teachers = [];
    for (let i = 0; i < n; i++) {
      const uid = uuid().toString().slice(0, 4);
      const teacher = {
        id: 'T_' + uid,
        bio: 'test-teacher',
        name: 'teacher_' + uid,
        role: 'teacher',
        profileImage:
          'https://short-tutoring.s3.ap-northeast-2.amazonaws.com/default/profile.png',
        createdAt: new Date().toISOString(),
      };

      await this.userModel.create(teacher);
      teachers.push(teacher);
      const embedTeacher = new MessageBuilder()
        .setTitle('선생님 생성')
        .setColor(Number('#00ff00'))
        .addField('이름', teacher.name)
        .setImage(
          'https://short-tutoring.s3.ap-northeast-2.amazonaws.com/default/profile.png',
        );
      await teacherWebhook.send(embedTeacher);
    }

    const users = await this.userModel.scan().exec();
    await webhook.info(
      `[Init]\n학생 ${studentName}(${studentId}) 생성\n선생님 ${n}명 생성`,
    );
    await webhook.send(`\`\`\`json\n${JSON.stringify(users, null, 2)}\n\`\`\``);

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
    await webhook.success(`[Request]\n과외 요청 생성!\nid: ${requestId}`);

    const responseService = new ResponseService(
      this.userModel,
      this.requestModel,
      this.tutoringModel,
    );
    for (const teacher of teachers) {
      await teacherWebhook.success(
        `[Response Create]\n선생님 ${teacher.name}(${teacher.id})이 요청에 응답함`,
      );
      await responseService.create(requestId, teacher.id);
    }
    await studentWebhook.success(
      `[Response TeacherList]\n학생 ${studentName}(${studentId})이 ${n}개의 응답을 확인함`,
    );
    await webhook.send(
      `\`\`\`json\n//[Response TeacherList]\n${JSON.stringify(
        teachers,
        null,
        2,
      )}\n\`\`\``,
    );

    const tutoring = await responseService.select({
      requestId,
      studentId,
      teacherId: teachers[0].id,
    });
    await webhook.info(
      `[Response Select]\n학생 ${studentName}(${studentId})이 선생님 ${teachers[0].name}(${teachers[0].id})을 선택함`,
    );
    await studentWebhook.send(
      `\`\`\`json\n//[Response Select]\n${JSON.stringify(
        tutoring,
        null,
        2,
      )}\n\`\`\``,
    );

    for (const teacher of teachers) {
      await teacherWebhook.send(
        `\`\`\`json\n//[Response Check]\n${JSON.stringify(
          await responseService.check(requestId, teacher.id),
          null,
          2,
        )}\n\`\`\``,
      );
    }

    await webhook.info(
      `[Tutoring Create]\n학생 ${studentName}(${studentId})과 선생님 ${teachers[0].name}(${teachers[0].id})의 과외 생성`,
    );
  }
}
