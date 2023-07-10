import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateDiaryExerciseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public exerciseId!: string;

  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  public practiceDuration: number;
}
