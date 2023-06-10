import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from 'src/app.module';
import { HttpExceptionFilter } from 'src/common/filters/http.filter';
import { UncaughtExceptionFilter } from 'src/common/filters/uncaught.filter';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';
import { setAxiosDefault } from 'src/common/utils/axios';
import { CustomWinstonLogger } from 'src/logger/custom_winston_logger.service';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  setAxiosDefault();

  // enable cors on dev, on production I woulc
  // recommend setting allow origin for example.com and release.example.com
  // nginx can hotswap example.com and release.example.com once its tested

  if (process.env['NODE_ENV'] === 'development') {
    app.enableCors();
  }
  if (process.env['NODE_ENV'] === 'production') {
    app.enableCors({
      origin: [
        'https://subdomain.saasdq.com',
        'https://www.subdomain.saasdq.com',
        'https://releasecandidate.subdomain.saasdq.com',
        'https://www.releasecandidate.subdomain.saasdq.com',
      ],
    });
  }

  app.setGlobalPrefix('api');
  app.enableShutdownHooks();
  const logger = await app.resolve<CustomWinstonLogger>(CustomWinstonLogger);
  // Filters are checked in reverse order, so the last filter
  // used in the argument list is checked first
  app.useGlobalFilters(
    new UncaughtExceptionFilter(logger),
    new HttpExceptionFilter(),
  );
  app.useGlobalInterceptors(new LoggingInterceptor(logger));

  if (!process.env.PORT) throw new Error('no port');
  await app.listen(process.env.PORT || -1);

  logger.warn(`App started on port ${process.env.PORT}`);
  logger.warn(`NODE_ENV = ${process.env.NODE_ENV}`);
}

bootstrap();
