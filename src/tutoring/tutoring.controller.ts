import { AccessToken } from '../auth/entities/auth.entity';
import { TutoringOperation } from './descriptions/tutoring.operation';
import { AppointTutoringDto } from './dto/create-tutoring.dto';
import { TutoringService } from './tutoring.service';
import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
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
  info(@Param('questionId') questionId: string, @Headers() headers: Headers) {
    return this.tutoringService.info(questionId, AccessToken.userId(headers));
  }

  @ApiBearerAuth('Authorization')
  @ApiOperation(TutoringOperation.info)
  @Get('classroom/info/:questionId')
  classroomInfo(
    @Param('questionId') questionId: string,
    @Headers() headers: Headers,
  ) {
    return this.tutoringService.classroomInfo(
      questionId,
      AccessToken.userId(headers),
    );
  }

  @ApiTags('Teacher')
  @ApiBearerAuth('Authorization')
  @Get('start/:questionId')
  start(@Param('questionId') questionId: string, @Headers() headers: Headers) {
    return this.tutoringService.startTutoring(
      AccessToken.userId(headers),
      questionId,
    );
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
