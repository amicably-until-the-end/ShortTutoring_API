import { Injectable, NestMiddleware } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: any, res: any, next: () => void) {
    const token: string = req.headers.authorization;
    const vendor: string = req.headers.vendor;

    if (token === null || vendor === null) {
      next();
    }

    try {
      req.headers['userId'] = await this.authService.getUserIdFromAccessToken({
        vendor,
        token: token,
      });
      next();
    } catch (error) {
      next();
    }
  }
}
