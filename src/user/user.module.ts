import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UploadRepository } from '../upload/upload.repository';
import { UserRepository } from './user.repository';
import { AuthRepository } from '../auth/auth.repository';
import { JwtService } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { dynamooseModule } from '../config.dynamoose';

@Module({
  imports: [
    HttpModule.register({ timeout: 5000, maxRedirects: 5 }),
    dynamooseModule,
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
