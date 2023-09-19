import { AppModule } from './app.module';
import { configSwagger } from './config.swagger';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: false }));

  dotenv.config();
  configSwagger(app);

  await app.listen(3000);
}

bootstrap().then();
