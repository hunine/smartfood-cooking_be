import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public firstName!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public lastName!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public email!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public password!: string;
}
