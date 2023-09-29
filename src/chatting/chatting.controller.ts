import { AccessToken } from '../auth/entities/auth.entity';
import { ChattingService } from './chatting.service';
import { ChattingOperation } from './description/chatting.operation';
import { ChattingResponse } from './description/chatting.response';
import { Controller, Get, Headers } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('chatting')
@ApiTags('Chatting')
@ApiBearerAuth('Authorization')
export class ChattingController {
  constructor(private readonly chattingService: ChattingService) {}

  @ApiOperation(ChattingOperation.list)
  @ApiResponse(ChattingResponse.list.success)
  @Get('/list')
  getChatList(@Headers() headers: Headers) {
    return this.chattingService.getChatList(AccessToken.userId(headers));
  }
}
