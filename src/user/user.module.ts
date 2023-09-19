import { AuthRepository } from '../auth/auth.repository';
import { dynamooseModule } from '../config.dynamoose';
import { UploadRepository } from '../upload/upload.repository';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

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
