import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStartNutritionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public userId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public date: string;
}
