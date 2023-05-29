import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class IngredientDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public ingredientId!: string;

  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  public value!: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public unit!: string;
}

export class StepDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public content: string;

  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  public order: number;
}

export class CreateRecipeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public name!: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public description?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public levelId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public categoryId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public cuisineId!: string;

  @ApiProperty({ type: [IngredientDto] })
  @IsArray()
  @IsNotEmpty()
  public ingredients!: IngredientDto[];

  @ApiProperty({ type: [StepDto] })
  @IsArray()
  @IsNotEmpty()
  public steps!: StepDto[];
}
