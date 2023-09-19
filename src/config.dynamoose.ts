import {
  DynamooseModule,
  DynamooseModuleOptions,
  DynamooseOptionsFactory,
} from 'nestjs-dynamoose';
import * as process from 'process';
import { UserSchema } from './user/entities/user.schema';
import { AuthSchema } from './auth/entities/auth.schema';
import { ChattingSchema } from './chatting/entities/chatting.schema';
import { QuestionSchema } from './question/entities/question.schema';
import { TutoringSchema } from './tutoring/entities/tutoring.schema';

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

export const dynamooseModule = DynamooseModule.forFeature([
  {
    name: 'Auth',
    schema: AuthSchema,
  },
  {
    name: 'Chatting',
    schema: ChattingSchema,
  },
  {
    name: 'Question',
    schema: QuestionSchema,
  },
  {
    name: 'Tutoring',
    schema: TutoringSchema,
  },
  {
    name: 'User',
    schema: UserSchema,
  },
]);
