import { dynamooseModule } from '../config.dynamoose';
import { UploadRepository } from '../upload/upload.repository';
import { UserRepository } from '../user/user.repository';
import { QuestionController } from './question.controller';
import { QuestionRepository } from './question.repository';
import { QuestionService } from './question.service';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

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
