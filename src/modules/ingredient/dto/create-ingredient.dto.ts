import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateIngredientDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public name!: string;

  @ApiProperty()
  @IsPositive()
  @IsOptional()
  public kcal: number;

  @ApiProperty()
  @IsPositive()
  @IsOptional()
  public carbs: number;

  @ApiProperty()
  @IsPositive()
  @IsOptional()
  public protein: number;

  @ApiProperty()
  @IsPositive()
  @IsOptional()
  public fat: number;
}
