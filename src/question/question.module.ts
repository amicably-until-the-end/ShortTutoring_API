import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { DynamooseModule } from 'nestjs-dynamoose';
import { QuestionSchema } from './entities/question.schema';
import { UserSchema } from '../user/entities/user.schema';
import { HttpModule } from '@nestjs/axios';
import { QuestionRepository } from './question.repository';
import { UserRepository } from '../user/user.repository';
import { UploadRepository } from '../upload/upload.repository';

@Module({
  imports: [
    HttpModule.register({ timeout: 5000, maxRedirects: 5 }),
    DynamooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
      {
        name: 'Question',
        schema: QuestionSchema,
      },
    ]),
  ],
  controllers: [QuestionController],
  providers: [
    QuestionService,
    QuestionRepository,
    UserRepository,
    UploadRepository,
  ],
})
export class QuestionModule {}
