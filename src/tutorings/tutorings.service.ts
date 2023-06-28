import { Injectable } from '@nestjs/common';
import { CreateTutoringDto } from './dto/create-tutoring.dto';
import { UpdateTutoringDto } from './dto/update-tutoring.dto';

@Injectable()
export class TutoringsService {
  create(createTutoringDto: CreateTutoringDto) {
    return 'This action adds a new tutoring';
  }

  findAll() {
    return `This action returns all tutorings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tutoring`;
  }

  update(id: number, updateTutoringDto: UpdateTutoringDto) {
    return `This action updates a #${id} tutoring`;
  }

  remove(id: number) {
    return `This action removes a #${id} tutoring`;
  }
}
