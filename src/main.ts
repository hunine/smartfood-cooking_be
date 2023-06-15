import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BASE_URL, PORT } from '@config/env';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());

  const configSwagger = new DocumentBuilder()
    .setTitle('Smartfood API docs')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'token',
        description: 'Enter JWT token',
        in: 'header',
      },
      'token',
    )
    .setContact(
      'Hung Hoang Quang',
      'https://hunine.dev/',
      'hqhung201@gmail.com',
    )
    .build();
  const document = SwaggerModule.createDocument(app, configSwagger);

  SwaggerModule.setup('docs', app, document);

  await app.listen(PORT, () => {
    console.log('[SWAGGER UI] -', BASE_URL + '/docs');
  });
}
bootstrap();
