import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HttpModule } from '@nestjs/axios';
import { DynamooseModule } from 'nestjs-dynamoose';
import { UserSchema } from '../user/entities/user.schema';
import { UserRepository } from '../user/user.repository';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import { AuthSchema } from './entities/auth.schema';
import { UploadRepository } from '../upload/upload.repository';

@Module({
  imports: [
    HttpModule.register({ timeout: 5000, maxRedirects: 5 }),
    DynamooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
      {
        name: 'Auth',
        schema: AuthSchema,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    JwtService,
    UserRepository,
    UploadRepository,
  ],
  exports: [AuthRepository],
})
export class AuthModule {}
