import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const docsConfiguration = new DocumentBuilder()
    .setTitle('eCommerce - Restful API')
    .setDescription('API Documentation for eCommerce application')
    .setVersion('1.0.0')
    .setContact(
      'Angel Hincho',
      'https://github.com/ahincho',
      'ahincho@unsa.edu.pe',
    )
    .setTermsOfService('https://github.com/ahincho/Fractal-NodeJs-Backend')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, docsConfiguration);
  SwaggerModule.setup('/api/v1/docs', app, swaggerDocument);
  app.enableCors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  });
  const port = configService.get<number>('APP_PORT') || 3000;
  await app.listen(port);
}
bootstrap();
