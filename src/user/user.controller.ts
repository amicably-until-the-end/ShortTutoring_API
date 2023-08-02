import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExcludeEndpoint,
  ApiHeader,
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

  @ApiBearerAuth('Authorization')
  @ApiHeader({
    name: 'vendor',
    description: 'OAuth2 벤더',
    example: 'kakao',
    enum: ['kakao', 'naver', 'google'],
  })
  @ApiOperation(UserOperation.login)
  @ApiResponse(UserResponse.login)
  @Get('login')
  login(@Headers() headers: Headers) {
    return this.userService.login(AccessToken.authorization(headers));
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
