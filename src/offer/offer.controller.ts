import { AccessToken } from '../auth/entities/auth.entity';
import { OfferOperations } from './descriptions/offer.operation';
import { OfferParam } from './descriptions/offer.param';
import { AcceptOfferDto, ScheduleOfferDto } from './dto/accept-offer.dto';
import { OfferService } from './offer.service';
import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@Controller()
@ApiBearerAuth('Authorization')
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @ApiTags('Teacher')
  @Get('teacher/offer/append/:questionId')
  @ApiParam(OfferParam.questionId)
  @ApiOperation(OfferOperations.append)
  append(@Headers() headers: Headers, @Param('questionId') questionId: string) {
    return this.offerService.append(AccessToken.userId(headers), questionId);
  }

  @ApiTags('Teacher')
  @Post('teacher/offer/schedule/:questionId')
  @ApiParam(OfferParam.questionId)
  @ApiOperation(OfferOperations.accept)
  schedule(
    @Headers() headers: Headers,
    @Param('questionId') questionId: string,
    @Body() scheduleOfferDto: ScheduleOfferDto,
  ) {
    return this.offerService.schedule(
      AccessToken.userId(headers),
      scheduleOfferDto.chattingId,
      questionId,
      scheduleOfferDto.startTime,
      scheduleOfferDto.endTime,
    );
  }

  @ApiTags('Student')
  @Post('student/offer/accept/:questionId')
  @ApiParam(OfferParam.questionId)
  @ApiOperation(OfferOperations.accept)
  accept(
    @Headers() headers: Headers,
    @Param('questionId') questionId: string,
    @Body() acceptOfferDto: AcceptOfferDto,
  ) {
    return this.offerService.accept(
      AccessToken.userId(headers),
      acceptOfferDto.chattingId,
      questionId,
      acceptOfferDto.startTime,
      acceptOfferDto.endTime,
    );
  }
}
