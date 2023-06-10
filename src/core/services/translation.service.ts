import { Injectable } from '@nestjs/common';
import { delay } from 'src/common/utils/delay';

const CHATGPT_API_URL = 'https://api.openai.com/v1/chat/completions';
const PROMPT_LIMIT = 1500;

@Injectable()
export class TranslationService {
  async sendToChatGpt(text: string[], _authorization: string): Promise<string> {
    text = text.filter(e => e.trim().length > 0);
    await delay(100);
    return text.join('\n');
  }

  async translateV1(
    title: string,
    lines: string[],
    authorization: string,
  ): Promise<{ title: string; lines: string[] }> {
    const getQueuedTextLen = (lines: string[]) => {
      let ret = 0;
      lines.forEach(e => (ret += e.length));
      return ret;
    };

    const ret: {
      title: string;
      lines: string[];
    } = {
      title: '',
      lines: [],
    };
    ret.title = await this.sendToChatGpt([title], authorization);

    const queuedText: string[] = [];
    for (let i = 0; i < lines.length; i += 1) {
      queuedText.push(lines[i]);

      if (
        getQueuedTextLen(queuedText) >= PROMPT_LIMIT ||
        i === lines.length - 1
      ) {
        const result = await this.sendToChatGpt(queuedText, authorization);
        ret.lines.push(result);
      }
    }

    return ret;
  }
}

