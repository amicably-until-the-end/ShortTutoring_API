import { Controller, Get, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
@ApiBearerAuth('Authorization')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('accessTokenInfo')
  @ApiHeader({
    name: 'vendor',
    description: 'OAuth2 제공자',
    enum: ['kakao', 'naver', 'google'],
  })
  accessTokenInfo(@Headers('vendor') vendor: string, @Headers() headers: any) {
    return this.authService.accessTokenInfo(vendor, headers.authorization);
  }

  @Get('accessTokenUser')
  @ApiHeader({
    name: 'vendor',
    description: 'OAuth2 제공자',
    enum: ['kakao', 'naver', 'google'],
  })
  accessTokenUser(@Headers('vendor') vendor: string, @Headers() headers: any) {
    return this.authService.accessTokenUser(vendor, headers.authorization);
  }

  @Get('getUserFromAccessToken')
  @ApiHeader({
    name: 'vendor',
    description: 'OAuth2 제공자',
    enum: ['kakao', 'naver', 'google'],
  })
  getUserFromAccessToken(
    @Headers('vendor') vendor: string,
    @Headers() headers: any,
  ) {
    return this.authService.getUserFromAccessToken(
      vendor,
      headers.authorization,
    );
  }
}
