import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import {
  AuthenticateGuard,
  AuthorizeGuard,
} from '@app/auth/decorators/auth.decorator';
import { HttpExceptionFilter } from 'src/core/filters/http-exception.filter';
import { LoggingInterceptor } from 'src/core/interceptors/logging.interceptor';
import { TransformInterceptor } from 'src/core/interceptors/transform.interceptor';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/common/enums/role.enum';
import { UpRoleDto } from './dto/up-role.dto';

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

  @Patch('info')
  @AuthenticateGuard()
  async updateMyInfo(
    @Req() request,
    @Res() response,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const data = await this.userService.updateMyInfo(
        request.user.email,
        updateUserDto,
      );

      return new ResponseSuccess(
        RESPONSE_MESSAGES.USER.UPDATE_USER_INFO_SUCCESS,
        data,
        true,
      ).toOkResponse(response);
    } catch (error) {
      return new ResponseError(
        RESPONSE_MESSAGES.USER.UPDATE_USER_INFO_ERROR,
        error,
      ).sendResponse(response);
    }
  }

  @Patch('info/:id')
  @AuthorizeGuard([Role.SUPER_ADMIN, Role.ADMIN])
  async updateInfo(
    @Res() response,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const data = await this.userService.updateInfo(id, updateUserDto);

      return new ResponseSuccess(
        RESPONSE_MESSAGES.USER.UPDATE_USER_INFO_SUCCESS,
        data,
        true,
      ).toOkResponse(response);
    } catch (error) {
      return new ResponseError(
        RESPONSE_MESSAGES.USER.UPDATE_USER_INFO_ERROR,
        error,
      ).sendResponse(response);
    }
  }

  @Patch('stat')
  @AuthenticateGuard()
  async updateStat(
    @Body() updateUserStatDto: UpdateUserStatDto,
    @Req() request,
    @Res() response,
  ) {
    try {
      const data = await this.userService.updateStat(
        request.user.email,
        updateUserStatDto,
      );

      return new ResponseSuccess(
        RESPONSE_MESSAGES.USER.UPDATE_USER_STAT_SUCCESS,
        data,
        true,
      ).toOkResponse(response);
    } catch (error) {
      return new ResponseError(
        RESPONSE_MESSAGES.USER.UPDATE_USER_STAT_ERROR,
        error,
      ).sendResponse(response);
    }
  }

  @Get('count')
  @AuthorizeGuard([Role.SUPER_ADMIN, Role.ADMIN])
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
  @AuthorizeGuard([Role.SUPER_ADMIN, Role.ADMIN])
  async findAll(@Paginate() query: PaginateQuery) {
    return this.userService.findAll(query);
  }

  @Patch('up-role/:userId')
  @AuthorizeGuard([Role.SUPER_ADMIN])
  async upRole(
    @Res() response,
    @Param('userId') userId: string,
    @Body() upRoleDto: UpRoleDto,
  ) {
    try {
      const data = await this.userService.upRole(userId, upRoleDto);

      return new ResponseSuccess(
        RESPONSE_MESSAGES.USER.UPDATE_USER_INFO_SUCCESS,
        data,
        true,
      ).toOkResponse(response);
    } catch (error) {
      return new ResponseError(
        RESPONSE_MESSAGES.USER.UPDATE_USER_INFO_ERROR,
        error,
      ).sendResponse(response);
    }
  }

  // @Delete('deactivate/:userId')
  // @AuthorizeGuard([Role.SUPER_ADMIN])
  // async deactivateUser(@Param('userId') userId: string) {
  //   return this.userService.deactivateUser(userId);
  // }
}
