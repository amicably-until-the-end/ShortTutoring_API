import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  Success_CreateUserDto,
  Success_DeleteUserDto,
  Success_GetUserDto,
  Success_UpdateUserDto,
} from './dto/response-user.dto';
import { NotFoundDto } from '../HttpResponseDto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @ApiOperation({
    summary: '사용자 생성',
    description: '`USER`\n\n사용자를 생성합니다.\n\n',
  })
  @ApiResponse({
    status: 201,
    description: '사용자 생성 성공',
    type: Success_CreateUserDto,
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('findAll')
  @ApiOperation({
    summary: '[DEV] 모든 사용자 반환',
    description: '`DEV`\n\n모든 사용자를 반환합니다.',
  })
  findAll() {
    return this.userService.findAll();
  }

  @Get('read/:userId')
  @ApiOperation({
    summary: '사용자 정보',
    description: '`USER`\n\n사용자 정보를 반환합니다.',
  })
  @ApiParam({
    name: 'userId',
    description: '사용자 id',
    type: String,
    example: 'test-student-id',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 정보 불러오기 성공',
    type: Success_GetUserDto,
  })
  findOne(@Param('userId') userId: string) {
    return this.userService.findOne(userId);
  }

  @Post('update/:userId')
  @ApiOperation({
    summary: '사용자 정보 업데이트',
    description: '`USER`\n\n사용자 정보를 업데이트합니다.',
  })
  @ApiParam({
    name: 'userId',
    description: '사용자 id',
    type: String,
    example: 'test-student-id',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 정보 업데이트 성공',
    type: Success_UpdateUserDto,
  })
  @ApiResponse({
    status: 404,
    description: '사용자를 찾을 수 없습니다.',
    type: NotFoundDto,
  })
  update(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(userId, updateUserDto);
  }

  @Post('delete/:userId')
  @ApiOperation({
    summary: '사용자 삭제',
    description: '`USER`\n\n사용자를 삭제합니다.',
  })
  @ApiParam({
    name: 'userId',
    description: '사용자 id',
    type: String,
    example: 'test-student-id',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 정보를 성공적으로 삭제했습니다.',
    type: Success_DeleteUserDto,
  })
  @ApiResponse({
    status: 400,
    description: '사용자를 찾을 수 없습니다.',
    type: NotFoundDto,
  })
  remove(@Param('userId') userId: string) {
    return this.userService.remove(userId);
  }
}
