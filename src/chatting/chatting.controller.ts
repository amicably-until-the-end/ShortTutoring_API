import { AccessToken } from '../auth/entities/auth.entity';
import { ChattingService } from './chatting.service';
import { ChattingOperation } from './description/chatting.operation';
import { Controller, Get, Headers, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('chatting')
@ApiTags('Chatting')
@ApiBearerAuth('Authorization')
export class ChattingController {
  constructor(private readonly chattingService: ChattingService) {}

  @ApiOperation(ChattingOperation.list)
  @Get('/:chattingId')
  getChatRoomInfo(
    @Param('chattingId') chattingId: string,
    @Headers() headers: Headers,
  ) {
    return this.chattingService.findOne(
      chattingId,
      AccessToken.userId(headers),
    );
  }
}
