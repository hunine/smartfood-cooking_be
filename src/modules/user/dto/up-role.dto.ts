import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { UpRole } from 'src/common/enums/role.enum';

export class UpRoleDto {
  @ApiProperty()
  @IsEnum(UpRole)
  @IsNotEmpty()
  public role: UpRole;
}
