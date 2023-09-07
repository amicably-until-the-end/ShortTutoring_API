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
import { CreateChattingDto } from './dto/create-chatting.dto';
import { UpdateChattingDto } from './dto/update-chatting.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessToken } from '../auth/entities/auth.entity';

@Controller('chatting')
@ApiTags('Chatting')
export class ChattingController {
  constructor(private readonly chattingService: ChattingService) {}

  @Post()
  @ApiBearerAuth('Authorization')
  create(
    @Headers() headers: Headers,
    @Body() createChattingDto: CreateChattingDto,
  ) {
    return this.chattingService.create(
      AccessToken.userId(headers),
      createChattingDto,
    );
  }

  @Get()
  findAll() {
    return this.chattingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chattingService.findOne(+id);
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
