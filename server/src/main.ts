import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
// import { WsAdapter } from '@nestjs/platform-ws';

// import { IoAdapter } from '@nestjs/platform-socket.io';
// import { ServerOptions } from 'socket.io';
// import { ServerOptions } from 'socket.io';

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

  // // WebSocket 어댑터 설정
  // app.useWebSocketAdapter(new WsAdapter(app));

  // // WebSocket 어댑터 설정을 Socket.io에 맞게 변경
  // const ioAdapter = new IoAdapter(app);
  // ioAdapter.createIOServer = (port: number, options?: ServerOptions) => {
  //   return require('socket.io')(port, {  // HTTP 서버 포트와 동일한 포트 사용
  //     cors: {
  //       origin: 'http://localhost:5173', // 프론트엔드 URL
  //       credentials: true,
  //     },
  //     path: '/socket.io', // 기본 경로 명시적으로 설정 (변경 가능)
  //   });
  // };
  // app.useWebSocketAdapter(new IoAdapter(app));
  // app.useWebSocketAdapter(new IoAdapter(app));
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
