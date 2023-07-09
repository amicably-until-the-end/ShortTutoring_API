import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { v4 as uuid } from 'uuid';

@ApiTags('Request')
@Controller('request')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  @ApiOperation({
    summary: '과외 요청 생성',
    description: '`Student` 요청을 생성합니다.',
  })
  create(@Body() createRequestDto: CreateRequestDto) {
    const request = {
      id: uuid(),
      ...createRequestDto,
    };
    return this.requestsService.create(request);
  }

  @Get()
  @ApiOperation({
    summary: '모든 과외 요청 반환',
    description: '현재 모집중인 모든 과외 요청을 반환합니다.',
  })
  findAll() {
    return this.requestsService.findAll();
  }

  @Delete(':id')
  @ApiOperation({
    summary: '특정 과외 요청 삭제',
    description: '특정 과외 요청을 삭제합니다.',
  })
  remove(@Param('id') id: string) {
    return this.requestsService
      .remove(id)
      .then(() => `Request removed successfully\n${id}`);
  }
}
