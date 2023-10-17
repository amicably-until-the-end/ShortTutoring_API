import { AccessToken } from '../auth/entities/auth.entity';
import { TeacherOperation, UserOperation } from './descriptions/user.operation';
import { UserParam } from './descriptions/user.param';
import { UserResponse } from './descriptions/user.response';
import { CreateStudentDto, CreateTeacherDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { SetFCMTokenUserDto } from './dto/setFCMToken-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiTags('Student')
  @ApiOperation(UserOperation.signup.student)
  @ApiCreatedResponse(UserResponse.signup.student)
  @Post('student/signup')
  signupStudent(@Body() createStudentDto: CreateStudentDto) {
    return this.userService.signupStudent(createStudentDto);
  }

  @ApiTags('Teacher')
  @ApiOperation(UserOperation.signup.teacher)
  @ApiCreatedResponse(UserResponse.signup.teacher)
  @Post('teacher/signup')
  signupTeacher(@Body() createTeacherDto: CreateTeacherDto) {
    return this.userService.signupTeacher(createTeacherDto);
  }

  @ApiTags('User')
  @ApiOperation(UserOperation.login)
  @ApiResponse(UserResponse.login)
  @Post('user/login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @ApiTags('User')
  @ApiBearerAuth('Authorization')
  @ApiOperation(UserOperation.me.profile)
  @ApiResponse(UserResponse.me.profile)
  @Get('user/profile')
  profile(@Headers() header: Headers) {
    return this.userService.profile(AccessToken.userId(header));
  }

  @ApiTags('User')
  @ApiBearerAuth('Authorization')
  @ApiParam(UserParam.userId)
  @ApiOperation(UserOperation.otherProfile)
  @ApiResponse(UserResponse.profile)
  @Get('user/profile/:userId')
  otherProfile(@Headers() headers: Headers, @Param('userId') userId: string) {
    return this.userService.otherProfile(userId);
  }

  @ApiTags('User')
  @ApiBearerAuth('Authorization')
  @ApiOperation(UserOperation.me.updateProfile)
  @ApiResponse(UserResponse.me.updateProfile)
  @Post('user/profile/update')
  update(@Headers() headers: Headers, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(AccessToken.userId(headers), updateUserDto);
  }

  @ApiTags('User')
  @ApiBearerAuth('Authorization')
  @ApiParam(UserParam.userId)
  @ApiOperation(UserOperation.otherFollowers)
  @ApiResponse(UserResponse.followInfo)
  @Get('user/followers/:userId')
  otherFollowers(@Headers() headers: Headers, @Param('userId') userId: string) {
    return this.userService.otherFollowers(userId);
  }

  @ApiTags('User')
  @ApiBearerAuth('Authorization')
  @ApiParam(UserParam.userId)
  @ApiOperation(UserOperation.otherFollowing)
  @ApiResponse(UserResponse.followInfo)
  @Get('user/following/:userId')
  otherFollowing(@Headers() headers: Headers, @Param('userId') userId: string) {
    return this.userService.otherFollowing(userId);
  }

  @ApiTags('User')
  @ApiBearerAuth('Authorization')
  @ApiOperation(UserOperation.me.withdraw)
  @ApiResponse(UserResponse.me.withdraw)
  @Get('user/withdraw')
  withdraw(@Headers() headers: Headers) {
    return this.userService.withdraw(
      AccessToken.userId(headers),
      AccessToken.authorization(headers),
    );
  }

  @ApiTags('Student')
  @ApiBearerAuth('Authorization')
  @ApiParam(UserParam.userId)
  @ApiOperation(UserOperation.follow)
  @Get('student/follow/:userId')
  follow(@Headers() headers: Headers, @Param('userId') userId: string) {
    return this.userService.follow(AccessToken.userId(headers), userId);
  }

  @ApiTags('Student')
  @ApiBearerAuth('Authorization')
  @ApiParam(UserParam.userId)
  @ApiOperation(UserOperation.unfollow)
  @Get('student/unfollow/:userId')
  unfollow(@Headers() headers: Headers, @Param('userId') userId: string) {
    return this.userService.unfollow(AccessToken.userId(headers), userId);
  }

  @ApiTags('Student')
  @ApiBearerAuth('Authorization')
  @ApiOperation(UserOperation.following)
  @Get('student/following')
  following(@Headers() headers: Headers) {
    return this.userService.following(AccessToken.userId(headers));
  }

  @ApiTags('Teacher')
  @ApiBearerAuth('Authorization')
  @ApiOperation(UserOperation.followers)
  @Get('teacher/followers')
  followers(@Headers() headers: Headers) {
    return this.userService.followers(AccessToken.userId(headers));
  }

  @ApiTags('User')
  @ApiBearerAuth('Authorization')
  @ApiOperation(UserOperation.bestTeacher)
  @Get('user/list/teacher/best')
  getBestTeachers(@Headers() headers: Headers) {
    return this.userService.getBestTeachers(AccessToken.userId(headers));
  }

  @ApiTags('User')
  @ApiBearerAuth('Authorization')
  @ApiOperation(UserOperation.onlineTeacher)
  @ApiResponse(UserResponse.onlineTeacher)
  @Get('user/list/teacher/online')
  getOnlineTeachers(@Headers() headers: Headers) {
    return this.userService.getOnlineTeachers(AccessToken.userId(headers));
  }

  @ApiTags('User')
  @ApiBearerAuth('Authorization')
  @Post('user/fcmToken')
  setFCMToken(
    @Headers() headers: Headers,
    @Body() setFCMTokenUserDto: SetFCMTokenUserDto,
  ) {
    return this.userService.setFCMToken(
      AccessToken.userId(headers),
      setFCMTokenUserDto.fcmToken,
    );
  }

  @ApiTags('User')
  @ApiBearerAuth('Authorization')
  @Get('user/receiveFreeCoin')
  receiveFreeCoin(@Headers() headers: Headers) {
    return this.userService.receiveFreeCoin(AccessToken.userId(headers));
  }

  @ApiTags('User')
  @ApiBearerAuth('Authorization')
  @ApiOperation(UserOperation.tutoringList)
  @Get('user/tutoring/list')
  tutoringList(@Headers() headers: Headers) {
    return this.userService.tutoringList(AccessToken.userId(headers));
  }

  @ApiTags('Teacher')
  @ApiBearerAuth('Authorization')
  @ApiParam(UserParam.teacherId)
  @ApiOperation(TeacherOperation.reviewList)
  @Get('teacher/review/list/:teacherId')
  reviewList(
    @Headers() headers: Headers,
    @Param('teacherId') teacherId: string,
  ) {
    return this.userService.reviewList(teacherId);
  }
}
