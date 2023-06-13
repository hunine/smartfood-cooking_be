import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Recipe } from './entities/recipe.entity';
import { ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

@ApiTags('recipes')
@Controller('recipes')
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
