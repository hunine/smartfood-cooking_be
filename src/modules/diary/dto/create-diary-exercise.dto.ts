import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class CreateDiaryExerciseDto {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  public exerciseIds!: string[];
}
