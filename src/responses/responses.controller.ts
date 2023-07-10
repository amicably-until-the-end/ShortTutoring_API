import { Body, Controller, Delete, Param, Patch } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Response')
@Controller('response')
export class ResponsesController {
  constructor(private readonly responsesService: ResponsesService) {}

  @Patch(':id')
  @ApiOperation({
    summary: '특정 요청에 대한 선생님의 응답 생성',
    description: '`TEACHER`\n\n특정 요청 대기열에 자신을 추가합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '요청의 id',
  })
  @ApiBody({
    schema: {
      type: 'string',
      example: {
        teacher_id: '선생님의 id',
      },
    },
  })
  update(@Param('id') id: string, @Body('teacher_id') teacher_id: string) {
    return this.responsesService.update(id, teacher_id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '특정 응답 삭제',
    description: '`TEACHER`\n\n특정 응답을 삭제합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '요청 id',
  })
  @ApiBody({
    schema: {
      type: 'string',
      example: {
        teacher_id: '선생님의 id',
      },
    },
  })
  remove(@Param('id') id: string, @Body('teacher_id') teacher_id: string) {
    return this.responsesService.remove(id, teacher_id);
  }
}
