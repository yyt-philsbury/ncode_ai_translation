import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

export const HeaderRequired = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const value = request.headers[key];

    if (value === undefined) {
      throw new BadRequestException(`Missing required header: '${key}'`);
    }

    return value;
  },
);

