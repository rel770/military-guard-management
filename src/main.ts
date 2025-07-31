import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable custom exception filter globally
  app.useGlobalFilters(new HttpExceptionFilter());

  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Only allow properties that are defined in the DTO
      transform: true, // Automatically transform payloads to DTO instances
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
    }),
  );

  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(
      `Server is running on http://${process.env.HOST ?? 'localhost'}:${process.env.PORT ?? 3000}`,
    );
  });
}
bootstrap();
