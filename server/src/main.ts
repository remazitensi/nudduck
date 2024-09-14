import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 환경 변수에서 CORS origin을 설정
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

  // CORS 설정
  app.enableCors({
    origin: frontendUrl,
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });

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
