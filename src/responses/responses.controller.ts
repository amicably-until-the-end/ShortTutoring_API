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
@Controller('response')
export class ResponsesController {
  constructor(private readonly responsesService: ResponsesService) {}

  @Post()
  @ApiOperation({
    summary: '응답 대기열 생성',
    description:
      '`DEV`\n\n특정 요청에 대한 선생님들의 응답 대기열을 생성합니다.',
  })
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

  @Get(':request_id')
  @ApiOperation({
    summary: '특정 요청에 대한 선생님들의 응답 반환',
    description: '`STUDENT`\n\n특정 요청에 대한 선생님의 응답들을 반환합니다.',
  })
  findOne(@Param('request_id') request_id: string) {
    return this.responsesService.findOne(request_id);
  }

  @Patch(':request_id')
  @ApiOperation({
    summary: '특정 요청에 대한 선생님의 응답 생성',
    description: '`TEACHER`\n\n특정 요청 대기열에 자신을 추가합니다.',
  })
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
  @ApiOperation({
    summary: '모든 응답 삭제',
    description: '`DEV`\n\n모든 응답을 삭제합니다.',
  })
  removeAll() {
    return this.responsesService.removeAll();
  }

  @Delete(':id')
  @ApiOperation({
    summary: '특정 응답 삭제',
    description: '`DEV`\n\n특정 응답을 삭제합니다.',
  })
  remove(@Param('id') id: string) {
    return this.responsesService.remove(+id);
  }
}
