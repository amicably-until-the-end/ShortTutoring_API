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
      const { userId, role } = await this.authRepository.decodeJwt(jwt);
      req.headers['userId'] = userId;
      req.headers['role'] = role;
      next();
    } catch (error) {
      next();
    }
  }
}
