import { PartialType } from '@nestjs/swagger';
import { CreateDiaryDto } from '@app/diary/dto/create-diary.dto';

export class UpdateDiaryDto extends PartialType(CreateDiaryDto) {}
