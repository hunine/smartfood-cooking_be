import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCookingHistoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userEmail: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  recipeId: string;
}
