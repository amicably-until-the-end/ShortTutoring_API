import { AuthRepository } from './auth.repository';
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authRepository: AuthRepository) {}

  use(req: any, res: any, next: () => void) {
    try {
      const token: string = req.headers.authorization;
      const jwt = token.split(' ')[1];
      const { userId, role } = this.authRepository.decodeJwt(jwt);
      req.headers['userId'] = userId;
      req.headers['role'] = role;
      next();
    } catch (error) {
      next();
    }
  }
}
