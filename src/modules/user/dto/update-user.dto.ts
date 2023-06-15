import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  public height: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  public weight: number;
}
