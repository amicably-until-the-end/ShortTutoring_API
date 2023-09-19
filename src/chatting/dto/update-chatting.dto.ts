import { PartialType } from '@nestjs/swagger';
import { CreateChattingDto } from './create-chatting.dto';

export class UpdateChattingDto extends PartialType(CreateChattingDto) {}
