import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as process from 'process';

export const configSwagger = (app: INestApplication<any>) => {
  const config = new DocumentBuilder()
    .setExternalDoc(
      '에러 목록',
      'https://github.com/amicably-until-the-end/ShortTutoring_API/wiki/ShortTutoring-%EC%97%90%EB%9F%AC-%EB%AA%A9%EB%A1%9D',
    )
    .setTitle('ShortTutoring API')
    .setVersion('0.0')
    .addOAuth2({
      type: 'oauth2',
      description: 'OAuth2 인증',
      flows: {
        authorizationCode: {
          authorizationUrl: `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_REST_API_KEY}&redirect_uri=http://shorttutoring-493721324.ap-northeast-2.elb.amazonaws.com/auth/callback/authorize&response_type=code`,
          scopes: undefined,
        },
      },
    })
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
      },
      'Authorization',
    )
    .addTag('Dev', '개발용')
    .addTag('User', '모든 사용자')
    .addTag('Student', '학생')
    .addTag('Teacher', '선생님')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document);
};
