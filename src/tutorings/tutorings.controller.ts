import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TutoringsService } from './tutorings.service';
import { CreateTutoringDto } from './dto/create-tutoring.dto';
import { UpdateTutoringDto } from './dto/update-tutoring.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Tutoring')
@Controller('tutorings')
export class TutoringsController {
  constructor(private readonly tutoringsService: TutoringsService) {}

  @Post()
  create(@Body() createTutoringDto: CreateTutoringDto) {
    return this.tutoringsService.create(createTutoringDto);
  }

  @Get()
  findAll() {
    return this.tutoringsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tutoringsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTutoringDto: UpdateTutoringDto,
  ) {
    return this.tutoringsService.update(+id, updateTutoringDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tutoringsService.remove(+id);
  }
}
