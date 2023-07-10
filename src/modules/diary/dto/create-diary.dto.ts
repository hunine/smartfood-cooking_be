import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsPositive,
  IsString,
} from 'class-validator';
import { TypeOfMeal } from 'src/common/enums/type-of-meal.enum';

export class DishesDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public recipeId!: string;

  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  public totalPeople!: number;
}

export class CreateDiaryDto {
  @ApiProperty({
    type: [DishesDto],
  })
  @IsArray()
  @IsNotEmpty()
  dishes: DishesDto[];

  @ApiProperty()
  @IsEnum(TypeOfMeal)
  @IsNotEmpty()
  public typeOfMeal: TypeOfMeal;
}
