import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import {
  description as packageDescription,
  version as packageVersion,
} from '../package.json';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Start api endpoints with /api
  app.setGlobalPrefix('api', {
    exclude: ['sw'],
  });
  // Enables automatic validation computation
  // using class-validation decorators.
  app.useGlobalPipes(new ValidationPipe());
  // Enables automatic conversion of classes on
  // api/controller endpoints (e.g. body, query params etc).
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  // Enables prefix of 'v1' in api endpoints.
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  // express middleware
  app.use(helmet());

  // region Swagger
  const config = new DocumentBuilder()
    .setTitle('Sytac Sample NestJS API')
    .setDescription(packageDescription)
    .setVersion(packageVersion)
    .setContact(
      'Nikolas Andronopoulos',
      'https://github.com/N-Andronopoulos',
      'nikolas.andronopoulos@sytac.io',
    )
    .setLicense('MIT', 'https://opensource.org/license/mit')
    .addTag('Books', 'The books API')
    .addTag('Authors', 'The authors API')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('sw', app, document, {
    jsonDocumentUrl: 'sw/openapi.json',
    yamlDocumentUrl: 'sw/openapi.yaml',
  });
  // endregion

  await app.listen(3000);
}

bootstrap();
