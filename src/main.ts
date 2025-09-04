import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { corsOptions } from './config/cors.config';
import { setupSwaggerAuth } from './config/swagger-auth.config';

const logger = new Logger(bootstrap.name);
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  setupSwagger(app);
  setupSwaggerAuth(app);

  app.enableCors(corsOptions);
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err) => {
  logger.error('Error starting application:', err);
  process.exit(1);
});
