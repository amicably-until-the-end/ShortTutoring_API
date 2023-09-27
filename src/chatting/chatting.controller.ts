import { AccessToken } from '../auth/entities/auth.entity';
import { ChattingService } from './chatting.service';
import { ChattingOperation } from './description/chatting.operation';
import { ChattingResponse } from './description/chatting.response';
import { UpdateChattingDto } from './dto/update-chatting.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
} from '@nestjs/common';
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

  @Get()
  findAll() {
    return this.chattingService.findAll();
  }

  @Get(':chattingRoomId')
  findOne(@Param('chattingRoomId') id: string, @Headers() headers: Headers) {
    return this.chattingService.findOne(id, AccessToken.userId(headers));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChattingDto: UpdateChattingDto,
  ) {
    return this.chattingService.update(+id, updateChattingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chattingService.remove(+id);
  }
}
