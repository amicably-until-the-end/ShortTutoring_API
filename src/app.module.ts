import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DynamooseModule } from 'nestjs-dynamoose';
import { DynamooseConfig } from './config.dynamoose';
import { UserModule } from './user/user.module';
import { UploadModule } from './upload/upload.module';
import { TutoringModule } from './tutoring/tutoring.module';
import { AuthModule } from './auth/auth.module';
import { QuestionModule } from './question/question.module';
import { OfferModule } from './offer/offer.module';
import { AuthMiddleware } from './auth/auth.middleware';
import { HttpModule } from '@nestjs/axios';
import { SocketGateway } from './socket/socket.gateway';
import { SocketModule } from './socket/socket.module';
import { SocketRepository } from './socket/socket.repository';
import { ChattingModule } from './chatting/chatting.module';
import { RedisModule } from './redis/redis.module';
import { redisProvider } from './config.redis';

@Module({
  controllers: [AppController],
  imports: [
    HttpModule.register({ timeout: 5000, maxRedirects: 5 }),
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
    // SimulationModule,
    // ReviewModule,
  ],
  providers: [AppService, SocketGateway, SocketRepository, redisProvider],
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
