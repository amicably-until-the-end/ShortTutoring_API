import { AppModule } from './app.module';
import { configFirebase } from './config.firebase';
import { configSwagger } from './config.swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: false }));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  dotenv.config();
  configSwagger(app);
  configFirebase();

  await app.listen(3000);
}

bootstrap().then();
