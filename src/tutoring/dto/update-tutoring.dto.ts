import { PartialType } from '@nestjs/swagger';
import { CreateTutoringDto } from './create-tutoring.dto';

export class UpdateTutoringDto extends PartialType(CreateTutoringDto) {}
