import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  Res,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserStatDto } from './dto/update-user-stat.dto';
import {
  ResponseError,
  ResponseSuccess,
} from 'src/core/responses/response-exception';
import { RESPONSE_MESSAGES } from 'src/common/constants';
import { AuthenticateGuard } from '@app/auth/decorators/auth.decorator';
import { HttpExceptionFilter } from 'src/core/filters/http-exception.filter';
import { LoggingInterceptor } from 'src/core/interceptors/logging.interceptor';
import { TransformInterceptor } from 'src/core/interceptors/transform.interceptor';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

@ApiTags('users')
@Controller('users')
@UseFilters(new HttpExceptionFilter())
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @AuthenticateGuard()
  async getProfile(@Req() request, @Res() response) {
    try {
      const data = await this.userService.findOneByEmail(request.user.email, {
        getPassword: false,
      });

      return new ResponseSuccess(
        RESPONSE_MESSAGES.USER.GET_PROFILE_SUCCESS,
        data,
        true,
      ).toOkResponse(response);
    } catch (error) {
      return new ResponseError(
        RESPONSE_MESSAGES.USER.GET_PROFILE_ERROR,
        error,
      ).sendResponse(response);
    }
  }

  @Patch('profile')
  @AuthenticateGuard()
  async update(
    @Body() updateUserDto: UpdateUserStatDto,
    @Req() request,
    @Res() response,
  ) {
    try {
      await this.userService.update(request.user.email, updateUserDto);

      return new ResponseSuccess(
        RESPONSE_MESSAGES.USER.UPDATE_PROFILE_SUCCESS,
      ).toOkResponse(response);
    } catch (error) {
      return new ResponseError(
        RESPONSE_MESSAGES.USER.UPDATE_PROFILE_ERROR,
        error,
      ).sendResponse(response);
    }
  }

  @Get('count')
  async countAll(@Res() response) {
    try {
      const data = await this.userService.countAll();
      return new ResponseSuccess(
        RESPONSE_MESSAGES.USER.GET_USER_SUCCESS,
        data,
        true,
      ).toOkResponse(response);
    } catch (error) {
      return new ResponseError(
        RESPONSE_MESSAGES.USER.GET_USER_ERROR,
        error,
      ).sendResponse(response);
    }
  }

  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    return this.userService.findAll(query);
  }
}
