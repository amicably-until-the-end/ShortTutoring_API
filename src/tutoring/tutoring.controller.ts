import { Body, Controller, Post } from '@nestjs/common';
import { TutoringService } from './tutoring.service';
import {
  CreateTutoringDto,
  Success_CreateTutoringDto,
} from './dto/create-tutoring.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Tutoring')
@Controller('tutoring')
export class TutoringController {
  constructor(private readonly tutoringService: TutoringService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: '과외 생성 완료',
    type: Success_CreateTutoringDto,
  })
  @ApiOperation({
    summary: '과외 생성',
    description: '`STUDENT`\n\n과외를 생성합니다.',
  })
  create(@Body() createTutoringDto: CreateTutoringDto) {
    return this.tutoringService.create(createTutoringDto);
  }
}
