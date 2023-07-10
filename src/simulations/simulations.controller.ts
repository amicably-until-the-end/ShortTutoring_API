import { Body, Controller, Delete, Post } from '@nestjs/common';
import { SimulationsService } from './simulations.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Simulation')
@Controller('simulations')
export class SimulationsController {
  constructor(private readonly testsService: SimulationsService) {}

  @Post('matching')
  @ApiOperation({
    summary: '매칭 시뮬레이션',
    description:
      '학생과 선생님의 이름을 입력하면 매칭 과정을 디스코드에서 보여줍니다.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        student_name: {
          type: 'string',
          description: '학생의 이름',
          example: '난 학생이고',
        },
        teacher_name: {
          type: 'string',
          description: '선생님의 이름',
          example: '난 선생이야',
        },
      },
    },
  })
  matching(
    @Body('student_name') student_name: string,
    @Body('teacher_name') teacher_name: string,
  ) {
    return this.testsService.matching(student_name, teacher_name);
  }

  @Delete('removeAll')
  @ApiOperation({
    summary: '데이터 초기화',
    description: '`DEV`\n\n모든 데이터를 삭제합니다.',
  })
  removeAll() {
    return this.testsService.removeAll();
  }
}
