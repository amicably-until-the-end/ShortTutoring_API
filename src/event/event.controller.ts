import { CreateEventDto } from './dto/create-event.dto';
import { EventService } from './event.service';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';

@ApiTags('Event')
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @ApiExcludeEndpoint()
  @Post('create')
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  @Get('list')
  findAll() {
    return this.eventService.findAll();
  }
}
