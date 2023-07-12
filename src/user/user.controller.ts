import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.interface';
import {
  BadRequest_CreateUserDto,
  CreateUserDto,
  Success_CreateUserDto,
} from './dto/create-user.dto';
import {
  NotFound_UpdateUserDto,
  Success_UpdateUserDto,
  UpdateUserDto,
} from './dto/update-user.dto';
import { v4 as uuid } from 'uuid';
import { Success_GetUserDto } from './dto/get-user.dto';
import {
  NotFound_DeleteUserDto,
  Success_DeleteUserDto,
} from './dto/delete-user.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @ApiOperation({
    summary: '사용자 생성',
    description:
      '`USER`\n\n사용자를 생성합니다.\n\n' +
      '```json\n' +
      '// create-request.dto\n' +
      '{\n' +
      '    "name": "사용자 이름",\n' +
      '    "bio": "사용자 자기소개",\n' +
      '    "profileImage": "사용자 프로필 이미지의 base64 인코드 데이터",\n' +
      '    "role": "사용자 역할 [admin | student | teacher]",\n' +
      '}\n' +
      '````',
  })
  @ApiResponse({
    status: 201,
    description: '사용자 생성 성공',
    type: Success_CreateUserDto,
  })
  @ApiResponse({
    status: 400,
    description: '사용자 생성 실패',
    type: BadRequest_CreateUserDto,
  })
  create(@Body() createUsersDto: CreateUserDto) {
    const user: User = {
      id: uuid(),
      name: createUsersDto.name,
      bio: createUsersDto.bio,
      role: createUsersDto.role,
      profileImageURL: '',
      created_at: new Date().toISOString(),
    };
    return this.userService.create(user);
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
  findOne(@Param('userId') id: string) {
    return this.userService.findOne(id);
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
    description: '사용자 정보 업데이트 실패',
    type: NotFound_UpdateUserDto,
  })
  update(@Param('userId') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
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
    description: '사용자 삭제 성공',
    type: Success_DeleteUserDto,
  })
  @ApiResponse({
    status: 400,
    description: '사용자 삭제 실패',
    type: NotFound_DeleteUserDto,
  })
  remove(@Param('userId') id: string) {
    return this.userService.remove(id);
  }
}
