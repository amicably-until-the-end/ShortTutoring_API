import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateQuestionDto } from './dto/create-question.dto';
import { AccessToken } from '../auth/entities/auth.entity';
import { QuestionResponse } from './descriptions/question.response';
import { QuestionOperation } from './descriptions/question.operation';
import { QuestionQuery } from './descriptions/question.query';

@Controller()
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @ApiTags('Student')
  @ApiBearerAuth('Authorization')
  @ApiOperation(QuestionOperation.create)
  @ApiResponse(QuestionResponse.create.success)
  @Post('student/question/create')
  create(
    @Headers() headers: Headers,
    @Body() createQuestionDto: CreateQuestionDto,
  ) {
    return this.questionService.create(
      AccessToken.userId(headers),
      createQuestionDto,
    );
  }

  @ApiTags('Student')
  @ApiBearerAuth('Authorization')
  @ApiOperation(QuestionOperation.delete)
  @Get('student/question/delete/:questionId')
  delete(@Param('questionId') questionId: string, @Headers() headers: Headers) {
    return this.questionService.delete(AccessToken.userId(headers), questionId);
  }

  @ApiTags('Teacher')
  @ApiBearerAuth('Authorization')
  @ApiOperation(QuestionOperation.list)
  @ApiQuery(QuestionQuery.list)
  @Get('teacher/question/list')
  list(@Query('status') status: string) {
    return this.questionService.list(status);
  }
}
