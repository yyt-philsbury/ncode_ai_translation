import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import parseUrl = require('parse-url');
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { load as cheerioLoad } from 'cheerio';

export type UrlInfoType = {
  site: string;
  url: string;
  bookUrl: string;
  chapterUrl?: string;
};

export type FetchBookResultType = {
  title: string;
  summary: string;
  author: string;
};

export type FetchChapterResultType = {
  title: string;
  lines: string[];
};

@Injectable()
export class FetcherService {
  getCleanedUrlInfo(url: string): UrlInfoType {
    try {
      const parsedUrl = parseUrl(url, true);
      switch (parsedUrl.resource) {
        case 'ncode.syosetu.com':
          break;
        default:
          throw new Error(`Do not support parsing ${parsedUrl.resource}`);
      }
    } catch (err) {
      throw new BadRequestException(
        'Bad URL, should be https://ncode.syosetu.com/xxx/x',
      );
    }

    const parsedInfo = parseUrl(url, true);
    const cleanedUrl = `https://${parsedInfo.resource}${parsedInfo.pathname}`;
    switch (parsedInfo.resource) {
      case 'ncode.syosetu.com':
        const path = parsedInfo.pathname.split('/');
        return {
          site: 'ncode.syosetu.com',
          url: cleanedUrl,
          bookUrl: `https://ncode.syosetu.com/${path[1]}`,
          chapterUrl: path[2]
            ? `https://ncode.syosetu.com/${path[1]}/${path[2]}`
            : undefined,
        };
      default:
        throw new InternalServerErrorException(
          `Not supported resource ${parsedInfo.resource}`,
        );
    }
  }

  async getBookIntro(urlInfo: UrlInfoType): Promise<FetchBookResultType> {
    switch (urlInfo.site) {
      case 'ncode.syosetu.com':
        const rsp = await axios.get(urlInfo.bookUrl, {
          signal: AbortSignal.timeout(5000),
          timeout: 5000,
        });
        const htmlBody = rsp.data;
        const $ = cheerioLoad(htmlBody);

        const title = $('p.novel_title')?.text() || '';
        const summary = $('div#novel_ex')?.text().replaceAll('\n', '') || '';
        const author = $('div.novel_writername > a:first')?.text() || '';

        return {
          title,
          summary,
          author,
        };
      default:
        throw new Error(`Invalid URL ${urlInfo.site}`);
    }
  }

  async getChapterText(urlInfo: UrlInfoType): Promise<FetchChapterResultType> {
    const { chapterUrl } = urlInfo;
    if (!chapterUrl)
      throw new BadRequestException(
        `URL does not point to a chapter ${urlInfo.url}`,
      );

    switch (urlInfo.site) {
      case 'ncode.syosetu.com':
        const rsp = await axios.get(chapterUrl, {
          signal: AbortSignal.timeout(5000),
          timeout: 5000,
          params: {
            url: chapterUrl,
          },
        });
        const htmlBody = rsp.data;
        const $ = cheerioLoad(htmlBody);

        const chapter_title = $('p.novel_subtitle')?.text() || '';
        const lines = $('div#novel_honbun > p')
          .toArray()
          .map(node => {
            const element = $(node);

            // let text = element.text().trim().replaceAll('\n', '');
            // if ($(element).find('ruby').length > 0) {
            //   const rbOnly = $(`div#novel_honbun > p[id=${node.attribs.id}] rb`);
            //   text = rbOnly.text().trim().replaceAll('\n', '');
            // }

            return element.text().trim().replaceAll('\n', '');
          });

        return {
          title: chapter_title,
          lines,
        };
      default:
        throw new Error(`Invalid URL ${urlInfo.site}`);
    }
  }
}

