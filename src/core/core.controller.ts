import { BadRequestException, Controller, Get } from '@nestjs/common';
import { QueryRequired } from 'src/common/decorators/query_required.decorator';
import { FetcherService } from 'src/core/services/fetcher.service';
import { CustomWinstonLogger } from 'src/logger/custom_winston_logger.service';
import lzString = require('lz-string/libs/lz-string.min.js');
import { HeaderRequired } from 'src/common/decorators/header_required.decorator';
import { TranslationService } from 'src/core/services/translation.service';

@Controller('v1/core')
export class CoreController {
  constructor(
    private readonly logger: CustomWinstonLogger,
    private readonly fetcherService: FetcherService,
    private readonly translateService: TranslationService,
  ) {
    logger.setContext(CoreController.name);
  }

  @Get('book')
  async getBookIntro(
    @QueryRequired('url') url: string,
    @HeaderRequired('authorization') authorization: string,
  ) {
    const urlInfo = this.fetcherService.getCleanedUrlInfo(url);
    const bookIntro = await this.fetcherService.getBookIntro(urlInfo);
    const author = await this.translateService.translateV1(
      bookIntro.title,
      [bookIntro.author],
      authorization,
    );

    const summary = await this.translateService.translateV1(
      bookIntro.title,
      [bookIntro.summary],
      authorization,
    );

    return {
      title: author.title,
      author: author.lines.join(),
      summary: summary.lines.join(),
    };
  }

  @Get('chapter')
  async getChapter(
    @QueryRequired('url') url: string,
    @HeaderRequired('authorization') authorization: string,
  ) {
    const urlInfo = this.fetcherService.getCleanedUrlInfo(url);
    const { chapterUrl } = urlInfo;

    if (!chapterUrl)
      throw new BadRequestException(
        `${chapterUrl} does not point to a chapter`,
      );

    const chapterText = await this.fetcherService.getChapterText(urlInfo);
    const translatedText = await this.translateService.translateV1(
      chapterText.title,
      chapterText.lines,
      authorization,
    );
    const compressedText = lzString.compressToUTF16(
      JSON.stringify(translatedText),
    ) as string;

    return compressedText;
  }
}

