import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

export function AuthenticateGuard() {
  return applyDecorators(ApiBearerAuth('token'), UseGuards(AuthGuard('jwt')));
}
