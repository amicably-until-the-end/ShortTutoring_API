import { Controller, Get, Headers, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthOperation } from './descriptions/auth.operation';
import { AccessToken } from './entities/auth.entity';
import { AuthResponse } from './descriptions/auth.response';

@ApiTags('Dev')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('callback/authorize')
  @ApiExcludeEndpoint()
  callbackAuthorize(
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('error') error: string,
    @Query('error_description') errorDescription: string,
  ) {
    return this.authService.callbackAuthorize(
      code,
      state,
      error,
      errorDescription,
    );
  }

  @Get('jwt/generate')
  @ApiOperation(AuthOperation.generateJwt)
  @ApiResponse(AuthResponse.generateJwt)
  @ApiHeader({
    name: 'vendor',
    description: 'OAuth2 벤더',
    example: 'kakao',
    enum: ['kakao', 'naver', 'google'],
  })
  generateJwt(@Headers() headers: Headers, @Query('code') code: string) {
    return this.authService.generateJwt(headers['vendor'], code);
  }

  @Get('jwt/decode')
  @ApiOperation(AuthOperation.decodeJwt)
  @ApiResponse(AuthResponse.decodeJwt)
  decodeJwt(@Query('jwt') jwt: string) {
    return this.authService.decodeJwt(jwt);
  }

  @Get('jwt/verify')
  @ApiOperation(AuthOperation.verifyJwt)
  @ApiResponse(AuthResponse.verifyJwt)
  verifyJwt(@Query('jwt') jwt: string) {
    console.log(jwt);
    return this.authService.verifyJwt(jwt);
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
