import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RequestsModule } from './requests/requests.module';
import { TutoringsModule } from './tutorings/tutorings.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ResponsesModule } from './responses/responses.module';
import { DynamooseModule } from 'nestjs-dynamoose';
import { DynamooseConfigService } from './dynamoose.config';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    DynamooseModule.forRootAsync({ useClass: DynamooseConfigService }),
    UsersModule,
    RequestsModule,
    ResponsesModule,
    TutoringsModule,
    ReviewsModule,
    UploadsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
