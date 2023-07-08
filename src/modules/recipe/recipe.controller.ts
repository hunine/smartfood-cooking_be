import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  Req,
  UseFilters,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Recipe } from './entities/recipe.entity';
import { ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import {
  AuthenticateGuard,
  AuthorizeGuard,
} from '@app/auth/decorators/auth.decorator';
import { LoggingInterceptor } from 'src/core/interceptors/logging.interceptor';
import { TransformInterceptor } from 'src/core/interceptors/transform.interceptor';
import { HttpExceptionFilter } from 'src/core/filters/http-exception.filter';
import {
  ResponseError,
  ResponseSuccess,
} from 'src/core/responses/response-exception';
import { RESPONSE_MESSAGES } from 'src/common/constants';
import { Role } from 'src/common/enums/role.enum';
import { RecommenderConfigDto } from './dto/recommender-config.dto';
import { RECOMMENDER_SERVICE } from '@config/env';

@ApiTags('recipes')
@Controller('recipes')
@UseFilters(new HttpExceptionFilter())
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get('ingredients')
  async findByIngredient(@Paginate() query: PaginateQuery) {
    return this.recipeService.findByIngredient(query);
  }

  @Get('recommend')
  @AuthenticateGuard()
  async findRecommend(@Req() request, @Res() response) {
    try {
      const userEmail = request.user.email || '';
      const data = await this.recipeService.findRecommendedRecipes(userEmail);

      return new ResponseSuccess(
        RESPONSE_MESSAGES.RECIPE.RECOMMEND_SUCCESS,
        data,
        true,
      ).toOkResponse(response);
    } catch (error) {
      return new ResponseError(
        RESPONSE_MESSAGES.RECIPE.RECOMMEND_FAILED,
        error,
      ).sendResponse(response);
    }
  }

  @Get('count')
  @AuthorizeGuard([Role.ADMIN])
  async countAll(@Res() response) {
    try {
      const data = await this.recipeService.countAll();
      return new ResponseSuccess(
        RESPONSE_MESSAGES.RECIPE.GET_RECIPE_SUCCESS,
        data,
        true,
      ).toOkResponse(response);
    } catch (error) {
      return new ResponseError(
        RESPONSE_MESSAGES.RECIPE.GET_RECIPE_ERROR,
        error,
      ).sendResponse(response);
    }
  }

  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    return this.recipeService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.recipeService.findOneById(id);
  }

  @Post('cook/:id')
  @AuthenticateGuard()
  async getRecipeToCook(
    @Param('id') id: string,
    @Req() request,
    @Res() response,
  ) {
    try {
      const userEmail = request.user.email || '';
      const data = await this.recipeService.getRecipeToCook(id, userEmail);

      return new ResponseSuccess(
        RESPONSE_MESSAGES.RECIPE.READY_TO_COOK,
        data,
        true,
      ).toNoContentResponse(response);
    } catch (error) {
      return new ResponseError(
        RESPONSE_MESSAGES.RECIPE.CAN_NOT_COOK,
        error,
      ).sendResponse(response);
    }
  }

  @Post()
  @AuthorizeGuard([Role.ADMIN])
  async create(@Body() createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    return this.recipeService.create(createRecipeDto);
  }

  @Post('recommend/config')
  async configRecommendService(
    @Res() response,
    @Body()
    data: RecommenderConfigDto,
  ) {
    try {
      const url = data.url || '';
      RECOMMENDER_SERVICE.URL = url;

      return new ResponseSuccess(
        RESPONSE_MESSAGES.RECIPE.RECOMMEND_SUCCESS,
        true,
      ).toNoContentResponse(response);
    } catch (error) {
      return new ResponseError(
        RESPONSE_MESSAGES.RECIPE.RECOMMEND_FAILED,
        error,
      ).sendResponse(response);
    }
  }

  @Put(':id')
  @AuthorizeGuard([Role.ADMIN])
  async update(
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ) {
    return this.recipeService.update(id, updateRecipeDto);
  }

  @Delete(':id')
  @AuthorizeGuard([Role.ADMIN])
  async remove(@Param('id') id: string) {
    return this.recipeService.remove(id);
  }

  @Delete()
  @AuthorizeGuard([Role.ADMIN])
  async multipleRemove(@Query('ids') ids: string[]) {
    return this.recipeService.multipleRemove(ids);
  }
}
