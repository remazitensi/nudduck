import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 아무 decorator도 없는 object를 걸러준다.
      forbidNonWhitelisted: true, // 잘못된 데이터를 요청하면, request를 막아준다.
      transform: true, // 요청으로 들어오는 데이터를 우리가 기대하는 DTO의 타입으로 자동 변환 해준다.
    }),
  );
  app.use(cookieParser());
  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('nudduck API')
    .setDescription('누떡 API 명세서')
    .setVersion('1.0.0')
    .addServer('http://localhost:3000/api-docs', 'Local Development Server')
    .addTag('Intro', 'API for main and intro pages')
    .addTag('User Management', 'API for user profile and authentication')
    .addTag('Simulation', 'API for simulation functions')
    .addTag('Community', 'API for community features')
    .addTag('Expert', 'API for expert consultation services')
    .addTag('LifeGraph', 'API for life graph generation and management')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
}

bootstrap();
