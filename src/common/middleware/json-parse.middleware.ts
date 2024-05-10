import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, json } from 'express';

@Injectable()
export class JsonParseMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => any) {
    json({ limit: '10mb' })(req, res, next);
  }
}
