import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DynamooseModule } from 'nestjs-dynamoose';
import { UserSchema } from './entities/user.schema';
import {AgoraModule} from "../agora/agora.module";

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
        options: {
          tableName: 'Users',
        },
      },
    ]),AgoraModule
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
