import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { configSwagger } from './config.swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  dotenv.config();
  configSwagger(app);

  await app.listen(3000);
}

bootstrap().then();
