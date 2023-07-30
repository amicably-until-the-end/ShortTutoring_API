import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as process from 'process';

export const configSwagger = (app: INestApplication<any>) => {
  const config = new DocumentBuilder()
    .setExternalDoc(
      'GitHub',
      'https://github.com/amicably-until-the-end/ShortTutoring_API/wiki',
    )
    .setTitle('ShortTutoring API')
    .setDescription(
      '### 태그 설명\n\n' +
        '- `STUDENT` : 학생\n\n' +
        '- `TEACHER` : 선생님\n\n' +
        '- `USER` : 모든 사용자\n\n' +
        '- `DEV` : 개발자\n\n' +
        '### 단어 설명\n\n' +
        '- **질문** : 학생이 문제에 대한 질문을 생성함\n\n' +
        '- **제안** : 선생님이 학생의 질문을 확인하고, 숏과외를 제안함\n\n',
    )
    .setVersion('0.0')
    .addOAuth2({
      type: 'oauth2',
      description: 'OAuth2 인증',
      flows: {
        authorizationCode: {
          authorizationUrl: `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_REST_API_KEY}&redirect_uri=http://shorttutoring-493721324.ap-northeast-2.elb.amazonaws.com:3000/auth/kakao/callback/authorize&response_type=code`,
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
    .addGlobalParameters({
      description: 'OAuth2 제공자',
      in: 'header',
      name: 'vendor',
      required: false,
      schema: {
        type: 'string',
        enum: ['kakao', 'naver', 'google'],
      },
    })
    .addTag('Dev', '개발용')
    .addTag('User', '모든 사용자')
    .addTag('Student', '학생')
    .addTag('Teacher', '선생님')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document);
};
