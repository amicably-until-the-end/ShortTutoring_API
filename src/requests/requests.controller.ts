import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { ApiTags } from '@nestjs/swagger';
import { v4 as uuid } from 'uuid';

@ApiTags('Request')
@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post('create')
  create(@Body() createRequestDto: CreateRequestDto) {
    const request = {
      id: uuid(),
      ...createRequestDto,
    };
    return this.requestsService.create(request);
  }

  @Get('findAll')
  findAll() {
    return this.requestsService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requestsService
      .remove(id)
      .then(() => `Request removed successfully\n${id}`);
  }
}
