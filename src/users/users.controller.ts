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
import { ApiTags } from '@nestjs/swagger';
import { User } from './user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { v4 as uuid } from 'uuid';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
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

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Get('findAll')
  findAll() {
    return this.usersService.findAll();
  }

  @Get('findOne/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Delete('remove/:id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Delete('removeAll')
  removeAll() {
    return this.usersService.removeAll();
  }
}
