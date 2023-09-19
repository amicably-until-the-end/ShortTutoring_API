import { AgoraModule } from '../agora/agora.module';
import { dynamooseModule } from '../config.dynamoose';
import { TutoringController } from './tutoring.controller';
import { TutoringRepository } from './tutoring.repository';
import { TutoringService } from './tutoring.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [dynamooseModule, AgoraModule],
  controllers: [TutoringController],
  providers: [TutoringService, TutoringRepository],
})
export class TutoringModule {}
