import { TutoringOperation } from './descriptions/tutoring.operation';
import { AppointTutoringDto } from './dto/create-tutoring.dto';
import { TutoringService } from './tutoring.service';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
  @Get('info/:questionId')
  info(@Param('questionId') questionId: string) {
    return this.tutoringService.info(questionId);
  }

  @ApiBearerAuth('Authorization')
  @ApiOperation(TutoringOperation.appoint)
  @Post('appoint/:questionId')
  appoint(
    @Param('questionId') questionId: string,
    @Body() appointTutoringDto: AppointTutoringDto,
  ) {
    return this.tutoringService.reserveTutoring(
      questionId,
      appointTutoringDto.startTime,
      appointTutoringDto.endTime,
    );
  }
}
