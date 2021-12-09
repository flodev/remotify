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
  if (process.env.HOST) {
    await app.listen(process.env.APP_PORT, process.env.HOST);
  } else {
    await app.listen(process.env.APP_PORT);
  }
}
bootstrap();
