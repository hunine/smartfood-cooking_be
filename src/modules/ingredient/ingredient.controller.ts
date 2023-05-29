import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

@ApiTags('ingredients')
@Controller('ingredients')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    return this.ingredientService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ingredientService.findOneById(id);
  }

  @Post()
  async create(@Body() createIngredientDto: CreateIngredientDto) {
    return this.ingredientService.create(createIngredientDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateIngredientDto: UpdateIngredientDto,
  ) {
    return this.ingredientService.update(id, updateIngredientDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.ingredientService.remove(id);
  }

  @Delete()
  async multipleRemove(@Query('ids') ids: string[]) {
    return this.ingredientService.multipleRemove(ids);
  }
}
