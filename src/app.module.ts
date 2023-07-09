import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DynamooseModule } from 'nestjs-dynamoose';
import { DynamooseConfig } from './config.dynamoose';
import { UsersModule } from './users/users.module';
import { UploadsModule } from './uploads/uploads.module';
import { RequestsModule } from './requests/requests.module';
import { ResponsesModule } from './responses/responses.module';

@Module({
  imports: [
    DynamooseModule.forRootAsync({ useClass: DynamooseConfig }),
    UsersModule,
    UploadsModule,
    RequestsModule,
    ResponsesModule,
    // TutoringsModule,
    // ReviewsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
