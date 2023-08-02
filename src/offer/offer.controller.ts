import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { OfferService } from './offer.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OfferOperations } from './descriptions/offer.operation';
import { OfferParam } from './descriptions/offer.param';
import { AccessToken } from '../auth/entities/auth.entity';
import { OfferResponse } from './descriptions/offer.response';
import { AcceptOfferDto } from './dto/accept-offer.dto';

@Controller('question/offer')
@ApiBearerAuth('Authorization')
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @ApiTags('Teacher')
  @Get('append/:questionId')
  @ApiParam(OfferParam.questionId)
  @ApiOperation(OfferOperations.append)
  append(@Headers() headers: Headers, @Param('questionId') questionId: string) {
    return this.offerService.append(AccessToken.userKey(headers), questionId);
  }

  @ApiTags('Teacher')
  @Post('remove/:questionId')
  @ApiParam(OfferParam.questionId)
  @ApiOperation(OfferOperations.remove)
  remove(@Headers() headers: Headers, @Param('questionId') questionId: string) {
    return this.offerService.remove(AccessToken.userKey(headers), questionId);
  }

  @ApiTags('Teacher')
  @Get('status/:questionId')
  @ApiParam(OfferParam.questionId)
  @ApiOperation(OfferOperations.getStatus)
  @ApiResponse(OfferResponse.getStatus.success)
  getStatus(
    @Headers() headers: Headers,
    @Param('questionId') questionId: string,
  ) {
    return this.offerService.getStatus(
      AccessToken.userKey(headers),
      questionId,
    );
  }

  @ApiTags('Student')
  @Get('teacher-list/:questionId')
  @ApiParam(OfferParam.questionId)
  @ApiOperation(OfferOperations.getTeachers)
  getTeachers(
    @Headers() headers: Headers,
    @Param('questionId') questionId: string,
  ) {
    return this.offerService.getTeachers(
      AccessToken.userKey(headers),
      questionId,
    );
  }

  @ApiTags('Student')
  @Post('accept/:questionId')
  @ApiParam(OfferParam.questionId)
  @ApiOperation(OfferOperations.accept)
  accept(
    @Headers() headers: Headers,
    @Param('questionId') questionId: string,
    @Body() acceptOfferDto: AcceptOfferDto,
  ) {
    return this.offerService.accept(
      AccessToken.userKey(headers),
      questionId,
      acceptOfferDto.teacherId,
    );
  }
}
