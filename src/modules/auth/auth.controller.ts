import {
  Body,
  Controller,
  Post,
  Put,
  Req,
  Res,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { ValidateAuthDto } from './dto/validate-auth.dto';
import { CreateUserDto } from '@app/user/dto/create-user.dto';
import { RESPONSE_MESSAGES } from 'src/common/constants';
import { LoggingInterceptor } from 'src/core/interceptors/logging.interceptor';
import { TransformInterceptor } from 'src/core/interceptors/transform.interceptor';
import { HttpExceptionFilter } from 'src/core/filters/http-exception.filter';
import {
  ResponseError,
  ResponseSuccess,
} from 'src/core/responses/response-exception';
import { AuthenticateGuard } from './decorators/auth.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('auth')
@Controller('auth')
@UseFilters(new HttpExceptionFilter())
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginData: ValidateAuthDto, @Res() response) {
    try {
      const data = await this.authService.validateLogin(loginData);
      return new ResponseSuccess(
        RESPONSE_MESSAGES.LOGIN.SUCCESS,
        data,
      ).toOkResponse(response);
    } catch (error) {
      return new ResponseError(
        RESPONSE_MESSAGES.LOGIN.ERROR,
        error,
      ).sendResponse(response);
    }
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto, @Res() response) {
    try {
      const data = await this.authService.register(createUserDto);
      return new ResponseSuccess(
        RESPONSE_MESSAGES.REGISTER.SUCCESS,
        data,
      ).toCreatedResponse(response);
    } catch (error) {
      return new ResponseError(
        RESPONSE_MESSAGES.REGISTER.ERROR,
        error,
      ).sendResponse(response);
    }
  }

  @Put('change-password')
  @AuthenticateGuard()
  async changePassword(
    @Req() request,
    @Res() response,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    try {
      const userEmail = request.user.email;
      const data = await this.authService.changePassword(
        userEmail,
        changePasswordDto,
      );
      return new ResponseSuccess(
        RESPONSE_MESSAGES.USER.CHANGE_PASSWORD_SUCCESS,
        data,
      ).toCreatedResponse(response);
    } catch (error) {
      return new ResponseError(
        RESPONSE_MESSAGES.USER.CHANGE_PASSWORD_ERROR,
        error,
      ).sendResponse(response);
    }
  }
}
