import { Global, Module } from '@nestjs/common';
import { CustomWinstonLogger } from 'src/logger/custom_winston_logger.class';

@Global()
@Module({
  providers: [CustomWinstonLogger],
  exports: [CustomWinstonLogger],
})
export class LoggerModule {}

