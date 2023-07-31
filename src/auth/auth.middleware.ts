import { Injectable, NestMiddleware } from '@nestjs/common';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authRepository: AuthRepository) {}

  async use(req: any, res: any, next: () => void) {
    const token: string = req.headers.authorization;
    const [type, jwt] = token.split(' ');
    if (type !== 'Bearer') {
      next();
    }
    try {
      const { vendor, userId } = await this.authRepository.decodeJwt(jwt);
      req.headers['vendor'] = vendor;
      req.headers['userId'] = userId;
      next();
    } catch (error) {
      next();
    }
  }
}
