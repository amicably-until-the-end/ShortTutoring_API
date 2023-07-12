import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Success_CreateResponseDto } from '../response/dto/create-response.dto';
import { Success_GetRequestsDto } from './dto/get-request.dto';
import {
  NotFound_DeleteRequestDto,
  Success_DeleteRequestDto,
} from './dto/delete-request.dto';

@ApiTags('Request')
@Controller('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post(':id')
  @ApiOperation({
    summary: '과외 요청 생성',
    description: '`STUDENT`\n\n요청을 생성합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '과외를 요청한 학생의 ID',
  })
  @ApiResponse({
    status: 201,
    description: '과외 요청을 성공적으로 생성했습니다.',
    type: Success_CreateResponseDto,
  })
  create(@Param('id') id: string, @Body() createRequestDto: CreateRequestDto) {
    return this.requestService.create(id, createRequestDto);
  }

  @Get('list')
  @ApiOperation({
    summary: '모든 과외 요청 반환',
    description: '`TEACHER`\n\n현재 모집중인 모든 과외 요청을 반환합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '모든 과외 요청을 성공적으로 반환했습니다.',
    type: Success_GetRequestsDto,
  })
  findAll() {
    return this.requestService.findAll();
  }

  @Post('delete/:id')
  @ApiOperation({
    summary: '특정 과외 요청 삭제',
    description: '`STUDENT`\n\n특정 과외 요청을 삭제합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '삭제할 과외 요청의 ID',
  })
  @ApiResponse({
    status: 200,
    description: '과외 요청을 성공적으로 삭제했습니다.',
    type: Success_DeleteRequestDto,
  })
  @ApiResponse({
    status: 404,
    description: '해당 과외 요청이 존재하지 않습니다.',
    type: NotFound_DeleteRequestDto,
  })
  remove(@Param('id') id: string) {
    return this.requestService
      .remove(id)
      .then(() => `Request removed successfully\n${id}`);
  }
}
