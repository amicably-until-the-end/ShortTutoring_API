import { AccessToken } from '../auth/entities/auth.entity';
import { QuestionOperation } from './descriptions/question.operation';
import { QuestionResponse } from './descriptions/question.response';
import {
  CreateNormalQuestionDto,
  CreateSelectedQuestionDto,
} from './dto/create-question.dto';
import { QuestionService } from './question.service';
import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller()
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @ApiTags('Student')
  @ApiBearerAuth('Authorization')
  @ApiOperation(QuestionOperation.createNormalQuestion)
  @ApiResponse(QuestionResponse.create.success)
  @Post('student/question/create/normal')
  createNormal(
    @Headers() headers: Headers,
    @Body() createQuestionDto: CreateNormalQuestionDto,
  ) {
    return this.questionService.createNormal(
      AccessToken.userId(headers),
      createQuestionDto,
    );
  }

  @ApiTags('Student')
  @ApiBearerAuth('Authorization')
  @ApiOperation(QuestionOperation.createSelectedQuestion)
  @ApiResponse(QuestionResponse.create.success)
  @Post('student/question/create/selected')
  createSelected(
    @Headers() headers: Headers,
    @Body() createQuestionDto: CreateSelectedQuestionDto,
  ) {
    return this.questionService.createSelected(
      AccessToken.userId(headers),
      createQuestionDto.requestTeacherId,
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
  @Get('teacher/question/list')
  list() {
    return this.questionService.getPendingNormalQuestions();
  }
}
