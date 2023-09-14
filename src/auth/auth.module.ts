import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HttpModule } from '@nestjs/axios';
import { UserRepository } from '../user/user.repository';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import { UploadRepository } from '../upload/upload.repository';
import { dynamooseModule } from '../config.dynamoose';

@Module({
  imports: [
    HttpModule.register({ timeout: 5000, maxRedirects: 5 }),
    dynamooseModule,
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
