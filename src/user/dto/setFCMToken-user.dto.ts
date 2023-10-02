import { ApiProperty } from '@nestjs/swagger';

export class SetFCMTokenUserDto {
  @ApiProperty({
    description: 'FCM 토큰',
    default: 'FCM_TOKEN',
  })
  fcmToken: string;
}
