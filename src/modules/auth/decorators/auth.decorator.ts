import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Role } from 'src/common/enums/role.enum';
import { RolesGuard } from '../guards/role.guard';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export function AuthenticateGuard() {
  return applyDecorators(ApiBearerAuth('token'), UseGuards(AuthGuard('jwt')));
}

export function AuthorizeGuard(roles: Role[]) {
  return applyDecorators(
    ApiBearerAuth('token'),
    UseGuards(AuthGuard('jwt')),
    Roles(...roles),
    UseGuards(RolesGuard),
  );
}
