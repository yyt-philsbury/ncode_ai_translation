import { Controller, Get } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { CustomWinstonLogger } from 'src/logger/custom_winston_logger.service';

@Controller('v1/example')
export class ExampleClusterController {
  constructor(private readonly logger: CustomWinstonLogger) {
    logger.setContext(ExampleClusterController.name);
  }

  @Get('cluster1')
  throw1() {
    /**
     * PM2 ecosystem.config.js pm2 app name.
     * We use this to determine which instance is the primary -
     * we use the primary instance to run scheduled cron jobs
     *
     * We need to build the app before we use pm2 (deploy* scripts)
     */
    return `current instanceName ${process.env.name}`;
  }

  @Get('test2')
  async parseNovelIntro() {
    const rsp = await axios.get('https://ncode.syosetu.com/n8406bm', {
      signal: AbortSignal.timeout(4000),
    });

    const htmlBody = rsp.data;
    const $ = cheerio.load(htmlBody);

    const title = $('p.novel_title')?.text() || '';
    const summary = $('div#novel_ex')?.text().replaceAll('\n', '') || '';

    return {
      title,
      summary,
    };
  }

  @Get('test1')
  async parseNovelChapter() {
    const rsp = await axios.get('https://ncode.syosetu.com/n8406bm/5', {
      signal: AbortSignal.timeout(4000),
    });
    const htmlBody = rsp.data;
    const $ = cheerio.load(htmlBody);

    const chapter_title = $('p.novel_subtitle')?.text() || '';
    const lines = $('div#novel_honbun > p')
      .toArray()
      .map(node => {
        const element = $(node);

        return {
          id: node.attribs.id,
          text: element.text().trim().replaceAll('\n', ''),
          hasRubyText: $(element).find('ruby').length > 0,
        };
      });

    return {
      title: chapter_title,
      lines,
    };
  }
}
