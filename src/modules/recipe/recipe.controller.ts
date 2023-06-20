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
} from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Recipe } from './entities/recipe.entity';
import { ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { AuthenticateGuard } from '@app/auth/decorators/auth.decorator';
import { LoggingInterceptor } from 'src/core/interceptors/logging.interceptor';
import { TransformInterceptor } from 'src/core/interceptors/transform.interceptor';
import { HttpExceptionFilter } from 'src/core/filters/http-exception.filter';

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

  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    return this.recipeService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.recipeService.findOneById(id);
  }

  @Get('cook/:id')
  @AuthenticateGuard()
  async getRecipeToCook(@Param('id') id: string, @Req() request) {
    const userEmail = request.user.email || '';
    return this.recipeService.getRecipeToCook(id, userEmail);
  }

  @Post()
  async create(@Body() createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    return this.recipeService.create(createRecipeDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ) {
    return this.recipeService.update(id, updateRecipeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.recipeService.remove(id);
  }

  @Delete()
  async multipleRemove(@Query('ids') ids: string[]) {
    return this.recipeService.multipleRemove(ids);
  }
}
