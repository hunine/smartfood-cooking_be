import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { Gender } from 'src/common/enums/gender.enum';

export class UpdateUserDto {
  @ApiProperty()
  @IsPositive()
  @IsNotEmpty()
  public age: number;

  @ApiProperty()
  @IsEnum(Gender)
  @IsNotEmpty()
  public gender: Gender;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  public height: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  public weight: number;
}
