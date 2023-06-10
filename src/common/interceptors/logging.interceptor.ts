import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CustomWinstonLogger } from 'src/logger/custom_winston_logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: CustomWinstonLogger) {
    logger.setContext(LoggingInterceptor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const method = request.method;
    const url = request.url;
    const requestTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse<FastifyReply>();
        const responseTime = Date.now();
        const msg = `${method} | ${response.statusCode} | ${url} | ${
          responseTime - requestTime
        } ms | ${request.ip}`;

        if (response.statusCode >= 400) {
          this.logger.error(msg);
        } else if (process.env.NODE_ENV === 'development') {
          this.logger.debug(msg);
        }
      }),
    );
  }
}

