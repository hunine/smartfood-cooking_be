import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateIngredientDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public name!: string;

  @ApiProperty()
  @IsDecimal()
  @IsOptional()
  public kcal: number;

  @ApiProperty()
  @IsDecimal()
  @IsOptional()
  public carbs: number;

  @ApiProperty()
  @IsDecimal()
  @IsOptional()
  public protein: number;

  @ApiProperty()
  @IsDecimal()
  @IsOptional()
  public fat: number;
}
