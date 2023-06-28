import {
  Body,
  Controller,
  Param,
  Post,
  Req,
  Res,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RecipeRatingService } from './recipe-rating.service';
import { AuthenticateGuard } from '@app/auth/decorators/auth.decorator';
import { RatingRecipeDto } from './dto/create-recipe-rating.dto';
import {
  ResponseError,
  ResponseSuccess,
} from 'src/core/responses/response-exception';
import { RESPONSE_MESSAGES } from 'src/common/constants';
import { HttpExceptionFilter } from 'src/core/filters/http-exception.filter';
import { LoggingInterceptor } from 'src/core/interceptors/logging.interceptor';
import { TransformInterceptor } from 'src/core/interceptors/transform.interceptor';

@ApiTags('recipe-ratings')
@Controller('recipe-ratings')
@UseFilters(new HttpExceptionFilter())
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class RecipeRatingController {
  constructor(private readonly recipeRatingService: RecipeRatingService) {}

  @Post('/:id')
  @AuthenticateGuard()
  async create(
    @Req() request,
    @Res() response,
    @Param('id') recipeId: string,
    @Body() ratingRecipeDto: RatingRecipeDto,
  ) {
    try {
      const userId = request.user.id;
      const data = await this.recipeRatingService.create({
        userId,
        recipeId,
        ...ratingRecipeDto,
      });

      return new ResponseSuccess(
        RESPONSE_MESSAGES.RECIPE_RATING.RATING_SUCCESS,
        data,
        true,
      ).toNoContentResponse(response);
    } catch (error) {
      return new ResponseError(
        RESPONSE_MESSAGES.RECIPE_RATING.RATING_ERROR,
        error,
      ).sendResponse(response);
    }
  }
}
