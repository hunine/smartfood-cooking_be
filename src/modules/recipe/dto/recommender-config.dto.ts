import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RecommenderConfigDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public url: string;
}
