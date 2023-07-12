import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const configSwagger = (app) => {
  const config = new DocumentBuilder()
    .setTitle('ShortTutoring API')
    .setDescription(
      '### 태그 설명\n\n' +
        '- `STUDENT` : 학생\n\n' +
        '- `TEACHER` : 선생님\n\n' +
        '- `USER` : 모든 사용자\n\n' +
        '- `DEV` : 개발자\n\n' +
        '### 단어 설명\n\n' +
        '- **요청** : 학생이 선생님에게 과외를 요청\n\n' +
        '- **응답** : 선생님이 학생의 요청에 응답\n\n' +
        '- **대기열** : 학생의 요청에 대한 선생님들의 응답 대기열\n\n' +
        '- **매칭** : 학생과 선생님의 과외 매칭\n\n' +
        '### HTTP 상태 코드 설명\n\n' +
        '- `200` : Success (성공)\n\n' +
        '- `201` : Created (생성 성공)\n\n' +
        '- `400` : Bad Request (잘못된 요청)\n\n' +
        '- `401` : Unauthorized (인증 필요)\n\n' +
        '- `403` : Forbidden (권한 없음)\n\n' +
        '- `404` : Not Found (리소스 없음)\n\n' +
        '- `409` : Conflict (충돌)\n\n' +
        '- `500` : Internal Server Error (서버 오류)',
    )
    .setVersion('0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document);
};
