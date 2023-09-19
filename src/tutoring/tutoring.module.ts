import { Module } from '@nestjs/common';
import { TutoringService } from './tutoring.service';
import { TutoringController } from './tutoring.controller';
import { TutoringRepository } from './tutoring.repository';
import { AgoraModule } from '../agora/agora.module';
import { dynamooseModule } from '../config.dynamoose';

@Module({
  imports: [dynamooseModule, AgoraModule],
  controllers: [TutoringController],
  providers: [TutoringService, TutoringRepository],
})
export class TutoringModule {}
