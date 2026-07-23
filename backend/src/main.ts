import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global API prefix matching REST specification
  app.setGlobalPrefix('api/v1');

  // Enforce DTO validation constraints globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Enforce global custom HttpException Filter for standardized responses
  app.useGlobalFilters(new HttpExceptionFilter());

  // Setup Swagger API Documentation Interface
  const swaggerConfig = new DocumentBuilder()
    .setTitle('SaaS Billing & Shop Management API')
    .setDescription('Enterprise-grade Multi-Tenant SaaS Billing and Shop Management REST API')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  // Resolve config service to parse runtime ports
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  // Enable Cross-Origin Resource Sharing (CORS)
  app.enableCors({
    origin: [
      'http://localhost:5173',          // local Vite
      'https://billing-app-coral.vercel.app' // production frontend
    ],// Restrict to client origins in production environments
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(port, '0.0.0.0');
  console.log(`API started on port ${port}`);
  console.log(`Swagger docs available at: http://localhost:${port}/api/docs`);
}
bootstrap();
