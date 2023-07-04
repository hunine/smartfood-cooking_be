import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public currentPassword!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public newPassword!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public confirmPassword!: string;
}
