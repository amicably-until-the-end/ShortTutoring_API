import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { HttpModule } from '@nestjs/axios';
import { QuestionRepository } from './question.repository';
import { UserRepository } from '../user/user.repository';
import { UploadRepository } from '../upload/upload.repository';
import { dynamooseModule } from '../config.dynamoose';

@Module({
  imports: [
    HttpModule.register({ timeout: 5000, maxRedirects: 5 }),
    dynamooseModule,
  ],
  controllers: [QuestionController],
  providers: [
    QuestionService,
    QuestionRepository,
    UserRepository,
    UploadRepository,
  ],
  exports: [QuestionRepository],
})
export class QuestionModule {}
