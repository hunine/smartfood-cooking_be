import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateRecipeRatingDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public userId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public recipeId!: string;

  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  public value!: number;
}

export class RatingRecipeDto {
  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  public value!: number;
}
