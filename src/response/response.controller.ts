import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ResponseService } from './response.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  NotFound_GetTeachersDTO,
  Success_GetTeachersDTO,
} from './dto/get-response.dto';
import {
  Not_checkDto,
  NotFound_checkDto,
  Success_CheckDto,
  Yet_checkDto,
} from './dto/check-response.dto';
import {
  BadRequest_SelectResponseDto,
  NotFound_CreateResponseDto,
  NotFound_SelectResponseDto,
  NotModified_SelectResponseDto,
  SelectResponseDto,
  Success_CreateResponseDto,
  Success_SelectResponseDto,
} from './dto/create-response.dto';
import {
  NotFound_DeleteResponseDto,
  Success_DeleteResponseDto,
} from './dto/delete-response.dto';

@ApiTags('Response')
@Controller('response')
export class ResponseController {
  constructor(private readonly responseService: ResponseService) {}

  @Get('teacherList/:id')
  @ApiOperation({
    summary: '특정 요청에 대한 선생님들의 목록 조회',
    description: '`STUDENT`\n\n특정 요청에 대한 선생님들의 목록을 조회합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '요청의 id',
  })
  @ApiResponse({
    status: 200,
    description: '선생님들의 목록을 성공적으로 조회했습니다.',
    type: Success_GetTeachersDTO,
  })
  @ApiResponse({
    status: 404,
    description: '해당 과외 요청이 존재하지 않습니다.',
    type: NotFound_GetTeachersDTO,
  })
  findOne(@Param('id') id: string) {
    return this.responseService.findOne(id);
  }

  @Post('check/:id')
  @ApiOperation({
    summary: '특정 요청에 대한 선택 여부 조회',
    description: '`TEACHER`\n\n특정 요청에 대한 선택 여부를 조회합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '요청의 id',
    example: 'test-request-id',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        teacher_id: {
          type: 'string',
          description: '선생님의 id',
          example: 'test-teacher-id',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '해당 선생님이 선택되었습니다.',
    type: Success_CheckDto,
  })
  @ApiResponse({
    status: 200,
    description: '해당 선생님이 선택되지 않았습니다.',
    type: Not_checkDto,
  })
  @ApiResponse({
    status: 200,
    description: '학생의 선택을 기다리고 있습니다.',
    type: Yet_checkDto,
  })
  @ApiResponse({
    status: 404,
    description: '해당 요청이 존재하지 않습니다.',
    type: NotFound_checkDto,
  })
  check(@Param('id') id: string, @Body('teacher_id') teacher_id: string) {
    return this.responseService.check(id, teacher_id);
  }

  @Post('create/:id')
  @ApiOperation({
    summary: '특정 요청에 대한 선생님의 응답 생성 (대기열 참가)',
    description: '`TEACHER`\n\n특정 요청 대기열에 자신을 추가합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '요청의 id',
    example: 'test-request-id',
  })
  @ApiBody({
    description: '선생님의 id',
    schema: {
      type: 'string',
      example: {
        teacher_id: 'test-teacher-id',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '해당 요청에 대한 응답을 성공적으로 생성했습니다.',
    type: Success_CreateResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '해당 요청이 존재하지 않습니다.',
    type: NotFound_CreateResponseDto,
  })
  update(@Param('id') id: string, @Body('teacher_id') teacher_id: string) {
    return this.responseService.update(id, teacher_id);
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
  @ApiResponse({
    status: 200,
    description: '요청이 성공적으로 처리되었습니다.',
    type: Success_DeleteResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '해당 요청이 존재하지 않습니다.',
    type: NotFound_DeleteResponseDto,
  })
  remove(@Param('id') id: string, @Body('teacher_id') teacher_id: string) {
    return this.responseService.remove(id, teacher_id);
  }

  @Post('select')
  @ApiOperation({
    summary: '특정 과외 응답 선택',
    description: '`STUDENT`\n\n특정 과외 응답을 선택합니다.',
  })
  @ApiBody({
    type: SelectResponseDto,
  })
  @ApiResponse({
    status: 200,
    description: '요청이 성공적으로 처리되었습니다.',
    type: Success_SelectResponseDto,
  })
  @ApiResponse({
    status: 304,
    description: '이미 선택된 선생님입니다.',
    type: NotModified_SelectResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '해당 요청이 존재하지 않습니다.',
    type: BadRequest_SelectResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '해당 선생님이 존재하지 않습니다.',
    type: NotFound_SelectResponseDto,
  })
  select(@Body() selectResponseDto: SelectResponseDto) {
    return this.responseService.select(selectResponseDto);
  }
}
