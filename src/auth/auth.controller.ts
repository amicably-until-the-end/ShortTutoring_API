import { Controller, Get, Headers, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AccessToken } from './entities/auth.entity';
import { AuthOperation } from './descriptions/auth.operation';

@ApiTags('Dev')
@Controller('auth')
@ApiBearerAuth('Authorization')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('accessToken/info')
  @ApiOperation(AuthOperation.accessTokenInfo)
  accessTokenInfo(@Headers() headers: Headers) {
    return this.authService.accessTokenInfo(
      new AccessToken(headers['vendor'], headers['authorization']),
    );
  }

  @Get('accessToken/userId')
  @ApiOperation(AuthOperation.getUserIdFromAccessToken)
  getUserIdFromAccessToken(@Headers() headers: Headers) {
    return this.authService.getUserIdFromAccessToken(
      new AccessToken(headers['vendor'], headers['authorization']),
    );
  }

  @Get('accessToken/user')
  @ApiOperation(AuthOperation.getUserFromAccessToken)
  getUserFromAccessToken(@Headers() headers: Headers) {
    return this.authService.getUserFromAccessToken(
      new AccessToken(headers['vendor'], headers['authorization']),
    );
  }

  @Get('kakao/callback/authorize')
  @ApiExcludeEndpoint()
  kakaoCallbackAuthorize(
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('error') error: string,
    @Query('error_description') errorDescription: string,
  ) {
    return this.authService.kakaoCallbackAuthorize(
      code,
      state,
      error,
      errorDescription,
    );
  }

  @Get('kakao/callback/token')
  @ApiOperation(AuthOperation.kakaoToken)
  kakaoToken(@Query('code') code: string) {
    return this.authService.kakaoToken(code);
  }
}
