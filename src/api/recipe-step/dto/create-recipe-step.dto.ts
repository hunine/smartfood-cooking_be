import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateRecipeStepDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public content!: string;

  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  public order!: number;
}
