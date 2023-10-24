import { AccessToken } from '../auth/entities/auth.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { EventService } from './event.service';
import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';

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
  @ApiBearerAuth('Authorization')
  findAll(@Headers() headers: Headers) {
    return this.eventService.findAll(AccessToken.role(headers));
  }
}
