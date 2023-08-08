import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthOperation } from './descriptions/auth.operation';
import { AuthResponse } from './descriptions/auth.response';
import { GetAccessTokenDto } from './dto/get-accesstoken.dto';

@ApiTags('Dev')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiExcludeEndpoint()
  @Get('callback/authorize')
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

  @ApiOperation(AuthOperation.decodeJwt)
  @ApiResponse(AuthResponse.decodeJwt)
  @Get('token/decode')
  decodeJwt(@Query('jwt') jwt: string) {
    return this.authService.decodeJwt(jwt);
  }

  @Post('access-token')
  getAccessToken(@Body() getAccessTokenDto: GetAccessTokenDto) {
    return this.authService.getAccessToken(getAccessTokenDto);
  }

  // @ApiBearerAuth('Authorization')
  // @ApiOperation(AuthOperation.accessTokenInfo)
  // @Get('accessToken/info')
  // accessTokenInfo(@Headers() headers: Headers) {
  //   return this.authService.accessTokenInfo(AccessToken.authorization(headers));
  // }
  //
  // @Get('accessToken/userId')
  // @ApiBearerAuth('Authorization')
  // @ApiOperation(AuthOperation.getUserIdFromAccessToken)
  // getUserIdFromAccessToken(@Headers() headers: Headers) {
  //   return this.authService.getUserIdFromAccessToken(
  //     headers['vendor'],
  //     headers['authorization'],
  //   );
  // }
  //
  // @Get('accessToken/user')
  // @ApiBearerAuth('Authorization')
  // @ApiOperation(AuthOperation.getUserFromAccessToken)
  // getUserFromAccessToken(@Headers() headers: Headers) {
  //   return this.authService.getUserFromAccessToken(
  //     headers['vendor'],
  //     headers['authorization'],
  //   );
  // }
}
