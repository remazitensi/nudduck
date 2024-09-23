import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  });

  app.use(cookieParser());

  // WebSocket 어댑터 설정
  app.useWebSocketAdapter(new WsAdapter(app));

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('nudduck API')
    .setDescription('누떡 API 명세서')
    .setVersion('1.0.0')
    .addServer('http://localhost:3000/api-docs', 'Local Development Server')
    .addTag('Intro', 'API for main and intro pages')
    .addTag('User Management', 'API for user profile and authentication')
    .addTag('Expert', 'API for expert consultation services')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(3000);
}

bootstrap();
