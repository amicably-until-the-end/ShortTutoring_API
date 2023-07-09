import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Response')
@Controller('responses')
export class ResponsesController {
  constructor(private readonly responsesService: ResponsesService) {}

  @Post()
  @ApiBody({
    schema: {
      type: 'string',
      example: {
        request_id: '요청의 id',
        student_id: '학생의 id',
      },
    },
  })
  create(
    @Body('request_id') request_id: string,
    @Body('student_id') student_id: string,
  ) {
    const response = {
      request_id: request_id,
      student_id: student_id,
      teacher_ids: [],
    };
    return this.responsesService.create(response);
  }

  @Get()
  findAll() {
    return this.responsesService.findAll();
  }

  @Get(':request_id')
  @ApiOperation({
    summary: '특정 요청에 대한 선생님들의 응답 반환',
    description:
      '`TEACHER` 학생의 특정 요청에 대한 선생님의 응답들을 반환합니다.',
  })
  findOne(@Param('request_id') request_id: string) {
    return this.responsesService.findOne(request_id);
  }

  @Patch(':request_id')
  @ApiBody({
    schema: {
      type: 'string',
      example: {
        teacher_id: '선생님의 id',
      },
    },
  })
  update(
    @Param('request_id') request_id: string,
    @Body('teacher_id') teacher_id: string,
  ) {
    return this.responsesService.update(request_id, teacher_id);
  }

  @Delete('removeAll')
  removeAll() {
    return this.responsesService.removeAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.responsesService.remove(+id);
  }
}
