import { PartialType } from '@nestjs/mapped-types';
import { CreateRecipeDto, IngredientDto, StepDto } from './create-recipe.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateRecipeDto extends PartialType(CreateRecipeDto) {
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
