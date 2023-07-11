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
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  BadRequestDto as BadRequest_PostSelectDto,
  PostSelectDto,
  RequestNotFoundDto as RequestNotFound_PostSelectDto,
  ResponseDto as Response_PostSelectDto,
} from './dto/select-response.dto';

@ApiTags('Response')
@Controller('response')
export class ResponsesController {
  constructor(private readonly responsesService: ResponsesService) {}

  @Get(':id')
  @ApiOperation({
    summary: '특정 요청에 대한 응답 조회',
    description: '`STUDENT`\n\n특정 요청에 대한 응답을 조회합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '요청의 id',
  })
  findOne(@Param('id') id: string) {
    return this.responsesService.findOne(id);
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
  })
  @ApiResponse({
    status: 201,
    description: '해당 선생님이 선택되지 않았습니다.',
  })
  @ApiResponse({
    status: 202,
    description: '학생의 선택을 기다리고 있습니다.',
  })
  @ApiResponse({
    status: 404,
    description: '해당 요청이 존재하지 않습니다.',
  })
  check(@Param('id') id: string, @Body('teacher_id') teacher_id: string) {
    return this.responsesService.check(id, teacher_id);
  }

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

  @Post('select')
  @ApiOperation({
    summary: '특정 과외 응답 선택',
    description: '`STUDENT`\n\n특정 과외 응답을 선택합니다.',
  })
  @ApiBody({
    type: PostSelectDto,
  })
  @ApiResponse({
    status: 200,
    description: '요청이 성공적으로 처리되었습니다.',
    type: Response_PostSelectDto,
  })
  @ApiResponse({
    status: 400,
    description: '요청이 잘못되었습니다.',
    type: BadRequest_PostSelectDto,
  })
  @ApiResponse({
    status: 404,
    description: '요청한 응답이 존재하지 않습니다.',
    type: RequestNotFound_PostSelectDto,
  })
  select(@Body() selectResponseDto: PostSelectDto) {
    return this.responsesService.select(selectResponseDto);
  }
}
