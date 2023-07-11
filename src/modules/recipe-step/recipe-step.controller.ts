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
import { AuthorizeGuard } from '@app/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('recipe-steps')
@Controller('recipe-steps')
export class RecipeStepController {
  constructor(private readonly recipeStepService: RecipeStepService) {}

  @Post()
  @AuthorizeGuard([Role.SUPER_ADMIN, Role.ADMIN])
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
  @AuthorizeGuard([Role.SUPER_ADMIN, Role.ADMIN])
  update(
    @Param('id') id: string,
    @Body() updateRecipeStepDto: UpdateRecipeStepDto,
  ) {
    return this.recipeStepService.update(+id, updateRecipeStepDto);
  }

  @Delete(':id')
  @AuthorizeGuard([Role.SUPER_ADMIN, Role.ADMIN])
  remove(@Param('id') id: string) {
    return this.recipeStepService.remove(+id);
  }
}
