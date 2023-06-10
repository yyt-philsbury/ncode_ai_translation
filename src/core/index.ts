import { Module } from '@nestjs/common';
import { CoreController } from 'src/core/core.controller';
import { FetcherService } from 'src/core/services/fetcher.service';
import { TranslationService } from 'src/core/services/translation.service';

@Module({
  providers: [FetcherService, TranslationService],
  controllers: [CoreController],
})
export class CoreModule {}

