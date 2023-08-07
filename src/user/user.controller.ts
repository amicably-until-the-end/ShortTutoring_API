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
import { CreateStudentDto, CreateTeacherDto } from './dto/create-user.dto';
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

  @ApiOperation(UserOperation.signup.student)
  @ApiCreatedResponse(UserResponse.signup.student)
  @Post('signup/student')
  signupStudent(@Body() createStudentDto: CreateStudentDto) {
    return this.userService.signupStudent(createStudentDto);
  }

  @ApiOperation(UserOperation.signup.teacher)
  @ApiCreatedResponse(UserResponse.signup.teacher)
  @Post('signup/teacher')
  signupTeacher(@Body() createTeacherDto: CreateTeacherDto) {
    return this.userService.signupTeacher(createTeacherDto);
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
    return this.userService.profile(AccessToken.userId(header));
  }

  @ApiBearerAuth('Authorization')
  @ApiOperation(UserOperation.me.updateProfile)
  @ApiResponse(UserResponse.me.updateProfile)
  @Post('profile/update')
  update(@Headers() headers: Headers, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(AccessToken.userId(headers), updateUserDto);
  }

  @ApiBearerAuth('Authorization')
  @ApiOperation(UserOperation.me.withdraw)
  @ApiResponse(UserResponse.me.withdraw)
  @Get('withdraw')
  withdraw(@Headers() headers: Headers) {
    return this.userService.withdraw(AccessToken.userId(headers));
  }

  // TODO: 다른 사용자의 프로필을 조회하는 API
  @ApiExcludeEndpoint()
  @ApiParam(UserParam.userId)
  @ApiOperation(UserOperation.otherProfile)
  @ApiResponse(UserResponse.profile)
  @Get(':userId/profile')
  otherProfile(@Headers() headers: Headers, @Param('userId') userId: string) {
    return this.userService.otherProfile(userId);
  }
}
