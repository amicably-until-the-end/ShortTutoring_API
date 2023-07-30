import { TutoringService } from './tutoring.service';
import { Controller } from '@nestjs/common';

@Controller('tutoring')
export class TutoringController {
  constructor(private readonly tutoringService: TutoringService) {}
}
