import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { v4 as uuid } from 'uuid';

@ApiTags('User')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  @ApiOperation({
    summary: '유저 생성',
    description: '유저를 생성합니다.',
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
    return this.usersService.create(user);
  }

  @Get('findAll')
  @ApiOperation({
    summary: '모든 사용자 반환',
    description: '`DEBUG` 모든 사용자를 반환합니다.',
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: '특정 사용자 정보',
    description: '특정 사용자 정보를 반환합니다.',
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: '사용자 정보 업데이트',
    description: '사용자 정보를 업데이트합니다.',
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete('removeAll')
  @ApiOperation({
    summary: '모든 사용자 삭제',
    description: '`DEBUG` 모든 사용자를 삭제합니다.',
  })
  removeAll() {
    return this.usersService.removeAll();
  }

  @Delete(':id')
  @ApiOperation({
    summary: '특정 사용자 삭제',
    description: '특정 사용자를 삭제합니다.',
  })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
