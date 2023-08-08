import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DynamooseModule } from 'nestjs-dynamoose';
import { UserSchema } from './entities/user.schema';
import { UploadRepository } from '../upload/upload.repository';
import { UserRepository } from './user.repository';
import { AuthRepository } from '../auth/auth.repository';
import { JwtService } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { AuthSchema } from '../auth/entities/auth.schema';

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
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    AuthRepository,
    JwtService,
    UploadRepository,
  ],
  exports: [UserRepository],
})
export class UserModule {}
