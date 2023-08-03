import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExcludeEndpoint,
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
import { LoginUserDto } from './dto/login-user.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation(UserOperation.signup)
  @ApiCreatedResponse(UserResponse.signup)
  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.userService.signup(createUserDto);
  }

  @ApiOperation(UserOperation.login)
  @ApiResponse(UserResponse.login)
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @ApiBearerAuth('Authorization')
  @ApiOperation(UserOperation.me.profile)
  @ApiResponse(UserResponse.me.profile)
  @Get('profile')
  profile(@Headers() header: Headers) {
    return this.userService.profile(AccessToken.userKey(header));
  }

  @ApiBearerAuth('Authorization')
  @ApiOperation(UserOperation.me.updateProfile)
  @ApiResponse(UserResponse.me.updateProfile)
  @Post('profile/update')
  update(@Headers() headers: Headers, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(AccessToken.userKey(headers), updateUserDto);
  }

  @ApiBearerAuth('Authorization')
  @ApiOperation(UserOperation.me.withdraw)
  @ApiResponse(UserResponse.me.withdraw)
  @Get('withdraw')
  withdraw(@Headers() headers: Headers) {
    return this.userService.withdraw(AccessToken.userKey(headers));
  }

  // TODO: 다른 사용자의 프로필을 조회하는 API
  @ApiExcludeEndpoint()
  @ApiParam(UserParam.userId)
  @ApiOperation(UserOperation.otherProfile)
  @ApiResponse(UserResponse.profile)
  @Get(':userId/profile')
  otherProfile(@Headers() headers: Headers, @Param('userId') userId: string) {
    return this.userService.otherProfile({ vendor: headers['vendor'], userId });
  }
}
