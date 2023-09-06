import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChattingService } from './chatting.service';
import { CreateChattingDto } from './dto/create-chatting.dto';
import { UpdateChattingDto } from './dto/update-chatting.dto';

@Controller('chatting')
export class ChattingController {
  constructor(private readonly chattingService: ChattingService) {}

  @Post()
  create(@Body() createChattingDto: CreateChattingDto) {
    return this.chattingService.create(createChattingDto);
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
  update(@Param('id') id: string, @Body() updateChattingDto: UpdateChattingDto) {
    return this.chattingService.update(+id, updateChattingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chattingService.remove(+id);
  }
}
