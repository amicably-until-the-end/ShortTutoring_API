import { Controller, Get, Headers, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthOperation } from './descriptions/auth.operation';
import { AccessToken } from './entities/auth.entity';

@ApiTags('Dev')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

  @Get('createJwt')
  @ApiOperation(AuthOperation.jwt)
  createJwt(@Headers() headers: Headers, @Query('code') code: string) {
    console.log(headers['vendor'], code);
    return this.authService.createJwt(headers['vendor'], code);
  }

  @Get('accessToken/info')
  @ApiBearerAuth('Authorization')
  @ApiOperation(AuthOperation.accessTokenInfo)
  accessTokenInfo(@Headers() headers: Headers) {
    return this.authService.accessTokenInfo(AccessToken.authorization(headers));
  }

  @Get('accessToken/userId')
  @ApiBearerAuth('Authorization')
  @ApiOperation(AuthOperation.getUserIdFromAccessToken)
  getUserIdFromAccessToken(@Headers() headers: Headers) {
    return this.authService.getUserIdFromAccessToken(
      headers['vendor'],
      headers['authorization'],
    );
  }

  @Get('accessToken/user')
  @ApiBearerAuth('Authorization')
  @ApiOperation(AuthOperation.getUserFromAccessToken)
  getUserFromAccessToken(@Headers() headers: Headers) {
    return this.authService.getUserFromAccessToken(
      headers['vendor'],
      headers['authorization'],
    );
  }
}
