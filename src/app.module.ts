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

@Module({
  imports: [
    DynamooseModule.forRootAsync({ useClass: DynamooseConfig }),
    AuthModule,
    UserModule,
    QuestionModule,
    OfferModule,
    UploadModule,
    TutoringModule,
    // SimulationModule,
    // ReviewModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'auth/kakao/callback/(.*)', method: RequestMethod.GET },
        { path: 'user/:userId/profile', method: RequestMethod.GET },
        { path: 'question/list', method: RequestMethod.GET },
      )
      .forRoutes({
        path: 'user/me/profile',
        method: RequestMethod.GET,
      })
      .apply(AuthMiddleware)
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });
  }
}
