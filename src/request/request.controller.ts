import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Request')
@Controller('request')
export class RequestController {
  constructor(private readonly requestsService: RequestService) {}

  @Post(':id')
  @ApiOperation({
    summary: '과외 요청 생성',
    description: '`STUDENT`\n\n요청을 생성합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '과외를 요청한 학생의 ID',
  })
  create(@Param('id') id: string, @Body() createRequestDto: CreateRequestDto) {
    return this.requestsService.create(id, createRequestDto);
  }

  @Get()
  @ApiOperation({
    summary: '모든 과외 요청 반환',
    description: '`TEACHER`\n\n현재 모집중인 모든 과외 요청을 반환합니다.',
  })
  findAll() {
    return this.requestsService.findAll();
  }

  @Delete(':id')
  @ApiOperation({
    summary: '특정 과외 요청 삭제',
    description: '`STUDENT`\n\n특정 과외 요청을 삭제합니다.',
  })
  remove(@Param('id') id: string) {
    return this.requestsService
      .remove(id)
      .then(() => `Request removed successfully\n${id}`);
  }
}
