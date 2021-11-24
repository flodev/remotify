import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    methods: 'POST,GET',
    allowedHeaders:
      'Authorization,Content-Type,Accept,Origin,Referer,User-Agent',
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.APP_PORT);
  // await app.listen(process.env.APP_PORT, '192.168.178.20');
}
bootstrap();
