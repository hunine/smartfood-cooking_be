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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { AuthorizeGuard } from '@app/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    return this.categoryService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.categoryService.findOneById(id);
  }

  @Post()
  @AuthorizeGuard([Role.ADMIN])
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Patch(':id')
  @AuthorizeGuard([Role.ADMIN])
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @AuthorizeGuard([Role.ADMIN])
  async remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }

  @Delete()
  @AuthorizeGuard([Role.ADMIN])
  async multipleRemove(@Query('ids') ids: string[]) {
    return this.categoryService.multipleRemove(ids);
  }
}
