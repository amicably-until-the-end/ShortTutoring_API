import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DynamooseModule } from 'nestjs-dynamoose';
import { DynamooseConfig } from './config.dynamoose';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    DynamooseModule.forRootAsync({ useClass: DynamooseConfig }),
    UsersModule,
    UploadsModule,
    // RequestsModule,
    // ResponsesModule,
    // TutoringsModule,
    // ReviewsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
