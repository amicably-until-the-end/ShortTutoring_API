import { AccessToken } from '../auth/entities/auth.entity';
import { OfferOperations } from './descriptions/offer.operation';
import { OfferParam } from './descriptions/offer.param';
import { AcceptOfferDto } from './dto/accept-offer.dto';
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

  /*
  @ApiTags('Teacher')
  @Post('teacher/offer/remove/:questionId')
  @ApiParam(OfferParam.questionId)
  @ApiOperation(OfferOperations.remove)
  remove(@Headers() headers: Headers, @Param('questionId') questionId: string) {
    return this.offerService.remove(AccessToken.userId(headers), questionId);
  }*/

  /*

  @ApiTags('Teacher')
  @Get('teacher/offer/status/:questionId')
  @ApiParam(OfferParam.questionId)
  @ApiOperation(OfferOperations.getStatus)
  @ApiResponse(OfferResponse.getStatus.success)
  getStatus(
    @Headers() headers: Headers,
    @Param('questionId') questionId: string,
  ) {
    return this.offerService.getStatus(AccessToken.userId(headers), questionId);
  }*/

  /*
  @ApiTags('Student')
  @Get('student/offer/teachers/:questionId')
  @ApiParam(OfferParam.questionId)
  @ApiOperation(OfferOperations.getTeachers)
  getTeachers(
    @Headers() headers: Headers,
    @Param('questionId') questionId: string,
  ) {
    return this.offerService.getTeachers(
      AccessToken.userId(headers),
      questionId,
    );
  }*/

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
