import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { SimulationService } from './simulation.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Simulation')
@Controller('simulation')
export class SimulationController {
  constructor(private readonly testService: SimulationService) {}

  @Get('createTest')
  @ApiOperation({
    summary: '[DEV] 테스트 데이터 생성',
    description: '`DEV`\n\n테스트 데이터를 생성합니다.',
  })
  createTest() {
    return this.testService.createTest();
  }

  @Get('onlyTest')
  @ApiOperation({
    summary: '[DEV] 초기화 후 테스트 데이터 생성',
  })
  onlyTest() {
    return this.testService.onlyTest();
  }

  @Get('getAll')
  @ApiOperation({
    summary: '[DEV] 모든 데이터 반환',
    description: '`DEV`\n\n모든 데이터를 반환합니다.',
  })
  getAll() {
    return this.testService.getAll();
  }

  @Delete('removeAll')
  @ApiOperation({
    summary: '[DEV] 데이터 초기화',
    description: '`DEV`\n\n모든 데이터를 삭제합니다.',
  })
  removeAll() {
    return this.testService.removeAll();
  }

  @Post('matching')
  @ApiOperation({
    summary: '[DEV] 매칭 시뮬레이션',
    description:
      '학생과 선생님의 이름을 입력하면 매칭 과정을 디스코드에서 보여줍니다.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        studentName: {
          type: 'string',
          description: '학생의 이름',
          example: '난 학생이고',
        },
        teacherName: {
          type: 'string',
          description: '선생님의 이름',
          example: '난 선생이야',
        },
      },
    },
  })
  matching(
    @Body('studentName') studentName: string,
    @Body('teacherName') teacherName: string,
  ) {
    return this.testService.matching(studentName, teacherName);
  }
}
