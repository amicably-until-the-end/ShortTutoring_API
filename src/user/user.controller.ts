import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserOperation } from './descriptions/user.operation';
import { UserParam } from './descriptions/user.param';
import { UserResponse } from './descriptions/user.response';
import { AccessToken } from '../auth/entities/auth.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiTags('Dev')
  @ApiBearerAuth('Authorization')
  @ApiOperation(UserOperation.signup)
  @ApiCreatedResponse(UserResponse.signup.success)
  @Post('signup')
  signup(@Headers() headers: Headers, @Body() createUserDto: CreateUserDto) {
    return this.userService.signup(
      AccessToken.fromHeaders(headers),
      createUserDto,
    );
  }

  @ApiTags('User')
  @ApiBearerAuth('Authorization')
  @ApiOperation(UserOperation.login)
  @ApiResponse(UserResponse.login.success)
  @ApiNotFoundResponse(UserResponse.login.notFound)
  @Get('login')
  login(@Headers() headers: Headers) {
    return this.userService.login(AccessToken.fromHeaders(headers));
  }

  @ApiTags('User')
  @ApiBearerAuth('Authorization')
  @ApiOperation(UserOperation.me.profile)
  @ApiResponse(UserResponse.me.profile.success)
  @ApiNotFoundResponse(UserResponse.me.profile.notFound)
  @Get('me/profile')
  profile(@Headers() header: Headers) {
    return this.userService.profile(AccessToken.fromHeaders(header));
  }

  @ApiTags('User')
  @ApiBearerAuth('Authorization')
  @ApiOperation(UserOperation.me.updateProfile)
  @ApiResponse(UserResponse.me.updateProfile.success)
  @ApiNotFoundResponse(UserResponse.me.updateProfile.notFound)
  @Post('me/updateProfile')
  update(@Headers() headers: Headers, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(
      AccessToken.fromHeaders(headers),
      updateUserDto,
    );
  }

  @ApiTags('User')
  @ApiBearerAuth('Authorization')
  @ApiOperation(UserOperation.me.withdraw)
  @ApiResponse(UserResponse.me.withdraw.success)
  @ApiNotFoundResponse(UserResponse.me.withdraw.notFound)
  @Get('me/withdraw')
  withdraw(@Headers() headers: Headers) {
    return this.userService.withdraw(AccessToken.fromHeaders(headers));
  }

  @ApiTags('User')
  @ApiParam(UserParam.userId)
  @ApiOperation(UserOperation.otherProfile)
  @ApiResponse(UserResponse.profile)
  @Get(':userId/profile')
  otherProfile(@Headers() headers: Headers, @Param('userId') userId: string) {
    return this.userService.otherProfile({ vendor: headers['vendor'], userId });
  }
}
