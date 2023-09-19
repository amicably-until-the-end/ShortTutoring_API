import { TutoringOperation } from './descriptions/tutoring.operation';
import { TutoringService } from './tutoring.service';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Tutoring')
@Controller('tutoring')
export class TutoringController {
  constructor(private readonly tutoringService: TutoringService) {}

  @ApiBearerAuth('Authorization')
  @Get('finish/:tutoringId')
  @ApiOperation(TutoringOperation.finish)
  finish(@Param('tutoringId') tutoringId: string) {
    return this.tutoringService.finish(tutoringId);
  }

  @ApiBearerAuth('Authorization')
  @ApiOperation(TutoringOperation.info)
  @Get('info/:tutoringId')
  info(@Param('tutoringId') tutoringId: string) {
    return this.tutoringService.info(tutoringId);
  }
}
