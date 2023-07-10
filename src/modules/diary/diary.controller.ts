import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../../core/filters/http-exception.filter';
import { LoggingInterceptor } from '../../core/interceptors/logging.interceptor';
import { TransformInterceptor } from '../../core/interceptors/transform.interceptor';
import { DiaryService } from '@app/diary/diary.service';
import { AuthenticateGuard } from '@app/auth/decorators/auth.decorator';
import { CreateDiaryDto } from './dto/create-diary.dto';
import {
  ResponseError,
  ResponseSuccess,
} from '../../core/responses/response-exception';
import { RESPONSE_MESSAGES } from '../../common/constants';
import { DatePipe } from '../../common/pipes/date.pipe';
import { CreateDiaryExerciseDto } from './dto/create-diary-exercise.dto';

@ApiTags('diaries')
@Controller('diaries')
@UseFilters(new HttpExceptionFilter())
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Get('')
  @AuthenticateGuard()
  async getDiary(
    @Req() request,
    @Res() response,
    @Query('date', DatePipe) date: string,
  ) {
    try {
      const userId = request.user.id || '';
      const data = await this.diaryService.getDiary(userId, date);

      return new ResponseSuccess(
        RESPONSE_MESSAGES.DIARY.GET_DIARY_SUCCESS,
        data,
        true,
      ).toOkResponse(response);
    } catch (error) {
      return new ResponseError(
        RESPONSE_MESSAGES.DIARY.GET_DIARY_ERROR,
        error,
      ).sendResponse(response);
    }
  }

  @Post('')
  @AuthenticateGuard()
  async createDiary(
    @Req() request,
    @Res() response,
    @Query('date', DatePipe) date: string,
    @Body() createDiaryDto: CreateDiaryDto,
  ) {
    try {
      const userId = request.user.id || '';
      const data = await this.diaryService.createDiary(
        userId,
        date,
        createDiaryDto,
      );

      return new ResponseSuccess(
        RESPONSE_MESSAGES.DIARY.CREATE_DIARY_SUCCESS,
        data,
        true,
      ).toOkResponse(response);
    } catch (error) {
      return new ResponseError(
        RESPONSE_MESSAGES.DIARY.CREATE_DIARY_ERROR,
        error,
      ).sendResponse(response);
    }
  }

  @Post('exercises')
  @AuthenticateGuard()
  async createDiaryExercise(
    @Req() request,
    @Res() response,
    @Query('date', DatePipe) date: string,
    @Body() createDiaryExerciseDto: CreateDiaryExerciseDto,
  ) {
    try {
      const userId = request.user.id || '';
      const data = await this.diaryService.createDiaryExercise(
        userId,
        date,
        createDiaryExerciseDto,
      );

      return new ResponseSuccess(
        RESPONSE_MESSAGES.DIARY.CREATE_DIARY_SUCCESS,
        data,
        true,
      ).toOkResponse(response);
    } catch (error) {
      return new ResponseError(
        RESPONSE_MESSAGES.DIARY.CREATE_DIARY_ERROR,
        error,
      ).sendResponse(response);
    }
  }

  @Delete('meals/:mealId')
  @AuthenticateGuard()
  async deleteRecipeInDiary(
    @Req() request,
    @Res() response,
    @Param('mealId') mealId: string,
  ) {
    try {
      const userId = request.user.id || '';
      await this.diaryService.deleteRecipeInDiary(userId, mealId);

      return new ResponseSuccess(
        RESPONSE_MESSAGES.DIARY.DELETE_DIARY_SUCCESS,
        true,
      ).toNoContentResponse(response);
    } catch (error) {
      return new ResponseError(
        RESPONSE_MESSAGES.DIARY.DELETE_DIARY_ERROR,
        error,
      ).sendResponse(response);
    }
  }

  @Delete('exercises/:exerciseId')
  @AuthenticateGuard()
  async deleteExerciseInDiary(
    @Req() request,
    @Res() response,
    @Param('exerciseId') exerciseId: string,
  ) {
    try {
      const userId = request.user.id || '';
      await this.diaryService.deleteExerciseInDiary(userId, exerciseId);

      return new ResponseSuccess(
        RESPONSE_MESSAGES.DIARY.DELETE_DIARY_SUCCESS,
        true,
      ).toNoContentResponse(response);
    } catch (error) {
      return new ResponseError(
        RESPONSE_MESSAGES.DIARY.DELETE_DIARY_ERROR,
        error,
      ).sendResponse(response);
    }
  }
}
