import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global API prefix matching Rest specifications
  app.setGlobalPrefix('api/v1');

  // Enable Cross-Origin Resource Sharing (CORS)
  app.enableCors({
    origin: '*', // Restrict this to designated client origins in production environments
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`API cluster running on: http://localhost:${port}/api/v1`);
}
bootstrap();
