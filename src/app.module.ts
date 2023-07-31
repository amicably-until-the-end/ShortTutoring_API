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
import { AuthRepository } from './auth/auth.repository';
import { HttpModule } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';

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
    // SimulationModule,
    // ReviewModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthRepository, JwtService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'auth/callback/authorize', method: RequestMethod.GET },
        { path: 'auth/jwt/(.*)', method: RequestMethod.GET },
        { path: 'user/:userId/profile', method: RequestMethod.GET },
        { path: 'question/list', method: RequestMethod.GET },
      )
      .forRoutes(
        { path: 'user/me/profile', method: RequestMethod.GET },
        {
          path: '*',
          method: RequestMethod.ALL,
        },
      )
      .apply(AuthMiddleware);
  }
}
