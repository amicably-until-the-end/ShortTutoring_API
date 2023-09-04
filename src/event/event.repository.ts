import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { AuthRepository } from '../auth/auth.repository';

@Injectable()
export class EventRepository {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async getUserRole(authorization: string) {
    const [type, jwt] = authorization.split(' ');
    if (type !== 'Bearer') {
      return 'guest';
    }

    console.log(jwt);
    try {
      const { role } = await this.authRepository.decodeJwt(jwt);
      console.log(role);
      return role;
    } catch (error) {
      console.log(error.message);
      return 'guest';
    }
  }
}
