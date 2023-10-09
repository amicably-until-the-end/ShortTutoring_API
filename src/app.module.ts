import { AuthMiddleware } from './auth/auth.middleware';
import { AuthModule } from './auth/auth.module';
import { ChattingModule } from './chatting/chatting.module';
import { DynamooseConfig } from './config.dynamoose';
import { EventModule } from './event/event.module';
import { OfferModule } from './offer/offer.module';
import { QuestionModule } from './question/question.module';
import { RedisModule } from './redis/redis.module';
import { SocketModule } from './socket/socket.module';
import { TutoringModule } from './tutoring/tutoring.module';
import { UploadModule } from './upload/upload.module';
import { UserModule } from './user/user.module';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';

@Module({
  imports: [
    DynamooseModule.forRootAsync({ useClass: DynamooseConfig }),
    AuthModule,
    UserModule,
    QuestionModule,
    OfferModule,
    UploadModule,
    TutoringModule,
    SocketModule,
    ChattingModule,
    RedisModule,
    EventModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'auth/(.*)', method: RequestMethod.ALL },
        { path: 'student/signup', method: RequestMethod.POST },
        { path: 'teacher/signup', method: RequestMethod.POST },
        { path: 'user/login', method: RequestMethod.POST },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL })
      .apply(AuthMiddleware);
  }
}
