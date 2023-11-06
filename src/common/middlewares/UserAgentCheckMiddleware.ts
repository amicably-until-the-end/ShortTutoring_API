import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class UserAgentCheckMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (process.env.NODE_ENV === 'prod') {
      const userAgent = req.headers['user-agent'] || '';

      if (userAgent.toLowerCase().includes('okhttp')) {
        // 유효한 User-Agent (예: okhttp)인 경우 다음 미들웨어 또는 핸들러로 이동
        next();
      } else {
        // 유효하지 않은 User-Agent인 경우 클라이언트에 에러 응답을 보냅니다.
        res.status(403).json({ error: 'Invalid User-Agent' });
      }
    } else {
      next();
    }
  }
}
