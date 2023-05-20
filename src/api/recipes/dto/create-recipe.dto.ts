import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRecipeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public name!: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public description?: string;
}
