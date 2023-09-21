import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import * as momentTimezone from 'moment-timezone';

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const config = new DocumentBuilder()
    .setTitle('Sambli Gourmet API')
    .setDescription('End points')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('v1/docs', app, document);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // remove propriedades desnecessárias no corpo da solicitação POST
  }));
  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors({
    origin: '*',
    allowedHeaders:
      'Content-Type, Access-Control-Allow-Headers, Authorization',
  });

  Date.prototype.toJSON = function (): any {
    return momentTimezone(this)
      .tz('America/Belem')
      .format('YYYY-MM-DD HH:mm:ss.SSS');
  }

  await app.listen(process.env.PORT || 3000);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
