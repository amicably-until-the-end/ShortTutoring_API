import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ResponseService } from './response.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SelectResponseDto } from './dto/select-response.dto';
import {
  Created_CreateResponseDto,
  Success_CheckResponseDto,
  Success_DeleteResponseDto,
  Success_GetTeachersDto,
  Success_SelectResponseDto,
} from './dto/response-response.dto';
import { BadRequestDto, ConflictDto, NotFoundDto } from '../HttpResponseDto';

@ApiTags('Response')
@Controller('response')
export class ResponseController {
  constructor(private readonly responseService: ResponseService) {}

  @Post('create/:requestId')
  @ApiOperation({
    summary: '과외 요청에 대한 선생님의 응답 생성 (대기열 참가)',
    description: '`TEACHER`\n\n과외 요청 대기열에 자신을 추가합니다.',
  })
  @ApiParam({
    name: 'requestId',
    description: '요청의 id',
    example: 'test-request-id',
  })
  @ApiBody({
    description: '선생님의 id',
    schema: {
      type: 'string',
      example: {
        teacherId: 'test-teacher-id',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '과외 요청에 대한 응답을 성공적으로 생성했습니다.',
    type: Created_CreateResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '과외 요청이 존재하지 않습니다.',
    type: NotFoundDto,
  })
  create(
    @Param('requestId') requestId: string,
    @Body('teacherId') teacherId: string,
  ) {
    return this.responseService.create(requestId, teacherId);
  }

  @Get('teacherList/:requestId')
  @ApiOperation({
    summary: '과외 요청에 대한 선생님들의 응답 목록 조회',
    description:
      '`STUDENT`\n\n과외 요청에 대한 선생님들의 응답 목록을 조회합니다.',
  })
  @ApiParam({
    name: 'requestId',
    description: '요청의 id',
    example: 'test-request-id',
  })
  @ApiResponse({
    status: 200,
    description: '선생님들의 목록을 성공적으로 조회했습니다.',
    type: Success_GetTeachersDto,
  })
  @ApiResponse({
    status: 404,
    description: '과외 요청이 존재하지 않습니다.',
    type: NotFoundDto,
  })
  getTeachers(@Param('requestId') requestId: string) {
    return this.responseService.getTeachers(requestId);
  }

  @Post('select')
  @ApiOperation({
    summary: '학생의 과외 선생님 선택',
    description: '`STUDENT`\n\n과외 응답 중 선생님을 선택합니다.',
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
    type: ConflictDto,
  })
  @ApiResponse({
    status: 400,
    description: '과외 요청이 존재하지 않습니다.',
    type: BadRequestDto,
  })
  @ApiResponse({
    status: 404,
    description: '과외 선생님이 존재하지 않습니다.',
    type: NotFoundDto,
  })
  select(@Body() selectResponseDto: SelectResponseDto) {
    return this.responseService.select(selectResponseDto);
  }

  @Post('check/:requestId')
  @ApiOperation({
    summary: '과외 요청에 대한 본인 선택 여부 조회',
    description: '`TEACHER`\n\n특정 요청에 대한 선택 여부를 조회합니다.',
  })
  @ApiParam({
    name: 'requestId',
    description: '요청의 id',
    example: 'test-request-id',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        teacherId: {
          type: 'string',
          description: '선생님의 id',
          example: 'test-teacher-id',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '선택 여부를 성공적으로 조회했습니다.',
    type: Success_CheckResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '리소스를 찾을 수 없습니다.',
    type: NotFoundDto,
  })
  check(
    @Param('requestId') requestId: string,
    @Body('teacherId') teacherId: string,
  ) {
    return this.responseService.check(requestId, teacherId);
  }

  @Post('delete/:requestId')
  @ApiOperation({
    summary: '과외 응답 삭제',
    description: '`TEACHER`\n\n특정 응답을 삭제합니다.',
  })
  @ApiParam({
    name: 'requestId',
    description: '요청 id',
    example: 'test-request-id',
  })
  @ApiBody({
    schema: {
      type: 'string',
      example: {
        teacherId: '선생님의 id',
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
    description: '과외 요청이 존재하지 않습니다.',
    type: NotFoundDto,
  })
  delete(
    @Param('requestId') requestId: string,
    @Body('teacherId') teacherId: string,
  ) {
    return this.responseService.delete(requestId, teacherId);
  }
}
