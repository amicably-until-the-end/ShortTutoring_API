import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ChattingService } from './chatting.service';
import { CreateChattingDto, SendMessageDto } from './dto/create-chatting.dto';
import { UpdateChattingDto } from './dto/update-chatting.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessToken } from '../auth/entities/auth.entity';

@Controller('chatting')
@ApiTags('Chatting')
@ApiBearerAuth('Authorization')
export class ChattingController {
  constructor(private readonly chattingService: ChattingService) {}

  @Post()
  create(
    @Headers() headers: Headers,
    @Body() createChattingDto: CreateChattingDto,
  ) {
    return this.chattingService.create(
      AccessToken.userId(headers),
      createChattingDto,
    );
  }

  @Post('send')
  sendMessage(
    @Headers() headers: Headers,
    @Body() sendMessageDto: SendMessageDto,
  ) {
    return this.chattingService.sendMessage(
      AccessToken.userId(headers),
      sendMessageDto,
    );
  }

  @Get()
  findAll() {
    return this.chattingService.findAll();
  }

  @Get(':chattingRoomId')
  findOne(@Param('chattingRoomId') id: string) {
    return this.chattingService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChattingDto: UpdateChattingDto,
  ) {
    return this.chattingService.update(+id, updateChattingDto);
  }

  @Delete('removeAll')
  removeAll() {
    return this.chattingService.removeAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chattingService.remove(+id);
  }
}
