import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import appConfig from "src/app.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(appConfig.cors);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(appConfig.httpPort);
}

bootstrap();