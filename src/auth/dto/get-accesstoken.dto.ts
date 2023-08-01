import { ApiProperty } from '@nestjs/swagger';

export class GetAccessTokenDto {
  @ApiProperty({
    description: 'OAuth 인가 코드를 발급받은 벤더',
    example: 'kakao',
    enum: ['kakao', 'naver', 'google'],
  })
  vendor: string;

  @ApiProperty({
    description: '발급받은 OAuth 인가 코드',
    default: 'OAUTH_AUTHORIZATION_CODE',
  })
  authorizationCode: string;
}
