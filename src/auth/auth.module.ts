import { dynamooseModule } from '../config.dynamoose';
import { UploadRepository } from '../upload/upload.repository';
import { UserRepository } from '../user/user.repository';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

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
