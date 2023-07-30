import { ApiProperty } from '@nestjs/swagger';

export class AccessToken {
  @ApiProperty({
    description: 'OAuth2 제공자',
    type: String,
  })
  vendor: string;

  @ApiProperty({
    description: 'OAuth2 제공자에서 제공하는 ID',
    type: String,
  })
  token: string;

  constructor(vendor: string, token: string) {
    this.vendor = vendor;
    this.token = token;
  }

  static fromHeaders(headers: Headers) {
    return { vendor: headers['vendor'], userId: headers['userId'] };
  }
}
