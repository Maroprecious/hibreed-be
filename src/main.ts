import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import * as config from 'config';
import * as express from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { HttpExceptionFilter, ResponseInterceptor } from './interceptors/response.interceptor';
import { join } from 'path';

async function bootstrap() {
  const globalPrefix = 'api';
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true
  })
  app.setGlobalPrefix(globalPrefix);

  app.use(express.json({ limit: "50mb" }));
  app.enableCors();
  app.use(
    express.urlencoded({
      limit: "50mb",
      extended: true,
      parameterLimit: 50000
    })
  );

  app.use(cookieParser());
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: false,
    })
  );
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/uploads/products/',
  });
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      whitelist: true
    })
  );

  const port = process.env.PORT || 3033;
  await app.listen(port);


  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
  Logger.log(`🚀 Running in ${process.env.NODE_ENV} mode`);
}
bootstrap();
