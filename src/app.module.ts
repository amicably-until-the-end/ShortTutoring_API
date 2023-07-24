import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DynamooseModule } from 'nestjs-dynamoose';
import { DynamooseConfig } from './config.dynamoose';
import { UserModule } from './user/user.module';
import { UploadModule } from './upload/upload.module';
import { RequestModule } from './request/request.module';
import { ResponseModule } from './response/response.module';
import { SimulationModule } from './simulation/simulation.module';
import { TutoringModule } from './tutoring/tutoring.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    DynamooseModule.forRootAsync({ useClass: DynamooseConfig }),
    UserModule,
    UploadModule,
    RequestModule,
    ResponseModule,
    TutoringModule,
    SimulationModule,
    AuthModule,
    // ReviewModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
