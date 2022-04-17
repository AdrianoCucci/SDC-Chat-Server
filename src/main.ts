import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import appConfig from "src/app.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: appConfig.cors,
    httpsOptions: appConfig.httpOptions
  });

  app.setGlobalPrefix(appConfig.baseHref);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(appConfig.httpPort);
}

bootstrap();