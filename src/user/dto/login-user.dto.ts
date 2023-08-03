import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    description: 'OAuth 인가 코드를 발급받은 벤더',
    example: 'kakao',
    enum: ['kakao', 'naver', 'google'],
  })
  vendor: string;

  @ApiProperty({
    description: '발급받은 OAuth 액세스 토큰',
    default: 'OAUTH_ACCESS_TOKEN',
  })
  accessToken: string;
}
