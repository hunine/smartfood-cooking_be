import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { ValidateAuthDto } from './dto/validate-auth.dto';
import { AuthenticateGuard } from './decorators/auth.decorator';
import { CreateUserDto } from '@app/user/dto/create-user.dto';
import { RESPONSE_MESSAGES } from 'src/common/constants';
import { LoggingInterceptor } from 'src/core/interceptors/logging.interceptor';
import { TransformInterceptor } from 'src/core/interceptors/transform.interceptor';
import { HttpExceptionFilter } from 'src/core/filters/http-exception.filter';
import {
  ResponseError,
  ResponseSuccess,
} from 'src/core/responses/response-exception';

@ApiTags('auth')
@Controller('auth')
@UseFilters(new HttpExceptionFilter())
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginData: ValidateAuthDto) {
    try {
      const response = await this.authService.validateLogin(loginData);
      return new ResponseSuccess(RESPONSE_MESSAGES.LOGIN.SUCCESS, response);
    } catch (error) {
      throw new ResponseError(RESPONSE_MESSAGES.LOGIN.ERROR, error);
    }
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const response = await this.authService.register(createUserDto);
      return new ResponseSuccess(RESPONSE_MESSAGES.REGISTER.SUCCESS, response);
    } catch (error) {
      throw new ResponseError(RESPONSE_MESSAGES.REGISTER.ERROR, error);
    }
  }

  @Get('profile')
  @AuthenticateGuard()
  async getProfile(@Request() req) {
    return req.user;
  }
}
