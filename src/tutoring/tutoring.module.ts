import { Module } from '@nestjs/common';
import { TutoringService } from './tutoring.service';
import { TutoringController } from './tutoring.controller';
import { DynamooseModule } from 'nestjs-dynamoose';
import { TutoringSchema } from './entities/tutoring.schema';
import { RequestSchema } from '../request/entities/request.schema';
import { AgoraModule } from '../agora/agora.module';

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'Request',
        schema: RequestSchema,
        options: {
          tableName: 'Requests',
        },
      },
      {
        name: 'Tutoring',
        schema: TutoringSchema,
        options: {
          tableName: 'Tutorings',
        },
      },
    ]),
    AgoraModule,
  ],
  controllers: [TutoringController],
  providers: [TutoringService],
  exports: [TutoringService],
})
export class TutoringModule {}
