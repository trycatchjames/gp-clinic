import 'reflect-metadata';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { env } from './config/env';
import { buildOpenApiDocument } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: false });

  app.setGlobalPrefix(env.globalPrefix);
  app.enableCors({
    origin: [env.webOrigin],
    credentials: true,
    exposedHeaders: ['ETag'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const document = buildOpenApiDocument(app);
  SwaggerModule.setup(`${env.globalPrefix}/docs`, app, document, {
    jsonDocumentUrl: `${env.globalPrefix}/docs/openapi.json`,
    swaggerOptions: { persistAuthorization: true, docExpansion: 'none' },
  });

  await app.listen(env.apiPort);
  const logger = new Logger('Bootstrap');
  logger.log(`API listening on http://localhost:${env.apiPort}/${env.globalPrefix}`);
  logger.log(`Swagger UI at http://localhost:${env.apiPort}/${env.globalPrefix}/docs`);
}

void bootstrap();
