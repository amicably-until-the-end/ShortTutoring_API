import { Body, Controller, Post } from '@nestjs/common';
import { TutoringService } from './tutoring.service';
import { CreateTutoringDto } from './dto/create-tutoring.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Tutoring')
@Controller('tutoring')
export class TutoringController {
  constructor(private readonly tutoringsService: TutoringService) {}

  @Post()
  @ApiResponse({
    status: 200,
    description: '과외 생성 완료',
  })
  @ApiOperation({
    summary: '과외 생성',
    description: '`STUDENT`\n\n과외를 생성합니다.',
  })
  create(@Body() createTutoringDto: CreateTutoringDto) {
    return this.tutoringsService.create(createTutoringDto);
  }
}
