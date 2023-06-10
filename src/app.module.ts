import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from 'src/core';
import { ExampleModule } from 'src/example/example.module';
import { LoggerModule } from 'src/logger/logger.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: `.env.${process.env.NODE_ENV}` }),
    ExampleModule,
    LoggerModule,
    CoreModule,
  ],
})
export class AppModule {}
