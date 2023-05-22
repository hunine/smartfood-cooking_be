import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RecipeStepService } from './recipe-step.service';
import { CreateRecipeStepDto } from './dto/create-recipe-step.dto';
import { UpdateRecipeStepDto } from './dto/update-recipe-step.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('recipe-steps')
@Controller('recipe-steps')
export class RecipeStepController {
  constructor(private readonly recipeStepService: RecipeStepService) {}

  @Post()
  create(@Body() createRecipeStepDto: CreateRecipeStepDto) {
    return this.recipeStepService.create(createRecipeStepDto);
  }

  @Get()
  findAll() {
    return this.recipeStepService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recipeStepService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRecipeStepDto: UpdateRecipeStepDto,
  ) {
    return this.recipeStepService.update(+id, updateRecipeStepDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recipeStepService.remove(+id);
  }
}
