import { Module } from '@nestjs/common';
import { TutoringService } from './tutoring.service';
import { TutoringController } from './tutoring.controller';
import { DynamooseModule } from 'nestjs-dynamoose';
import { TutoringSchema } from './entities/tutoring.schema';

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'Tutoring',
        schema: TutoringSchema,
      },
    ]),
  ],
  controllers: [TutoringController],
  providers: [TutoringService],
  exports: [TutoringService],
})
export class TutoringModule {}
