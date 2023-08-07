import { TutoringService } from './tutoring.service';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('tutoring')
export class TutoringController {
  constructor(private readonly tutoringService: TutoringService) {}

  @ApiBearerAuth('Authorization')
  @ApiTags('User')
  @Get('finish/:tutoringId')
  finish(@Param('tutoringId') tutoringId: string) {
    return this.tutoringService.finish(tutoringId);
  }

  @ApiBearerAuth('Authorization')
  @ApiTags('User')
  @Get('info/:tutoringId')
  info(@Param('tutoringId') tutoringId: string) {
    return this.tutoringService.info(tutoringId);
  }
}
