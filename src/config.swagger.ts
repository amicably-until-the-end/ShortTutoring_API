import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const configSwagger = (app) => {
  const config = new DocumentBuilder()
    .setTitle('ShortTutoring API')
    .setDescription('ShortTutoring API description')
    .setVersion('0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
};
