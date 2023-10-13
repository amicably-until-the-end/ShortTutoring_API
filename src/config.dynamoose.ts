import { AuthSchema } from './auth/entities/auth.schema';
import { ChattingSchema } from './chatting/entities/chatting.schema';
import { EventSchema } from './event/entities/event.schema';
import { QuestionSchema } from './question/entities/question.schema';
import { TutoringSchema } from './tutoring/entities/tutoring.schema';
import { UserSchema } from './user/entities/user.schema';
import {
  DynamooseModule,
  DynamooseModuleOptions,
  DynamooseOptionsFactory,
} from 'nestjs-dynamoose';
import * as process from 'process';

export class DynamooseConfig implements DynamooseOptionsFactory {
  createDynamooseOptions(): DynamooseModuleOptions {
    return {
      aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
      },
    };
  }
}

export const dynamooseModule =
  process.env.NODE_ENV === 'prod'
    ? DynamooseModule.forFeature([
        {
          name: 'Auth',
          schema: AuthSchema,
          options: {
            tableName: 'PROD_Auth',
          },
        },
        {
          name: 'Chatting',
          schema: ChattingSchema,
          options: {
            tableName: 'PROD_Chatting',
          },
        },
        {
          name: 'Event',
          schema: EventSchema,
          options: {
            tableName: 'PROD_Event',
          },
        },
        {
          name: 'Question',
          schema: QuestionSchema,
          options: {
            tableName: 'PROD_Question',
          },
        },
        {
          name: 'Tutoring',
          schema: TutoringSchema,
          options: {
            tableName: 'PROD_Tutoring',
          },
        },
        {
          name: 'User',
          schema: UserSchema,
          options: {
            tableName: 'PROD_User',
          },
        },
      ])
    : DynamooseModule.forFeature([
        {
          name: 'Auth',
          schema: AuthSchema,
          options: {
            tableName: 'DEV_Auth',
          },
        },
        {
          name: 'Chatting',
          schema: ChattingSchema,
          options: {
            tableName: 'DEV_Chatting',
          },
        },
        {
          name: 'Event',
          schema: EventSchema,
          options: {
            tableName: 'DEV_Event',
          },
        },
        {
          name: 'Question',
          schema: QuestionSchema,
          options: {
            tableName: 'DEV_Question',
          },
        },
        {
          name: 'Tutoring',
          schema: TutoringSchema,
          options: {
            tableName: 'DEV_Tutoring',
          },
        },
        {
          name: 'User',
          schema: UserSchema,
          options: {
            tableName: 'DEV_User',
          },
        },
      ]);
