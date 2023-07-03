import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty } from 'class-validator';
import { TypeOfMeal } from 'src/common/enums/type-of-meal.enum';

export class CreateDiaryDto {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  public recipeIds!: string[];

  @ApiProperty()
  @IsEnum(TypeOfMeal)
  @IsNotEmpty()
  public typeOfMeal: TypeOfMeal;
}
