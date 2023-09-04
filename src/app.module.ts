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
import { EventGateway } from './event/event.gateway';
import { EventModule } from './event/event.module';
import { EventRepository } from './event/event.repository';

@Module({
  imports: [
    HttpModule.register({ timeout: 5000, maxRedirects: 5 }),
    DynamooseModule.forRootAsync({ useClass: DynamooseConfig }),
    AuthModule,
    UserModule,
    QuestionModule,
    OfferModule,
    UploadModule,
    TutoringModule,
    EventModule,
    // SimulationModule,
    // ReviewModule,
  ],
  controllers: [AppController],
  providers: [AppService, EventGateway, EventRepository],
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
