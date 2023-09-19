import { CreateChattingDto } from './create-chatting.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateChattingDto extends PartialType(CreateChattingDto) {}
