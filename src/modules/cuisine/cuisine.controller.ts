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
import { CuisineService } from './cuisine.service';
import { CreateCuisineDto } from './dto/create-cuisine.dto';
import { UpdateCuisineDto } from './dto/update-cuisine.dto';
import { ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { AuthorizeGuard } from '@app/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('cuisine')
@Controller('cuisine')
export class CuisineController {
  constructor(private readonly cuisineService: CuisineService) {}

  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    return this.cuisineService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.cuisineService.findOneById(id);
  }

  @Post()
  @AuthorizeGuard([Role.SUPER_ADMIN, Role.ADMIN])
  async create(@Body() createCuisineDto: CreateCuisineDto) {
    return this.cuisineService.create(createCuisineDto);
  }

  @Patch(':id')
  @AuthorizeGuard([Role.SUPER_ADMIN, Role.ADMIN])
  async update(
    @Param('id') id: string,
    @Body() updateCuisineDto: UpdateCuisineDto,
  ) {
    return this.cuisineService.update(id, updateCuisineDto);
  }

  @Delete(':id')
  @AuthorizeGuard([Role.SUPER_ADMIN, Role.ADMIN])
  async remove(@Param('id') id: string) {
    return this.cuisineService.remove(id);
  }

  @Delete()
  @AuthorizeGuard([Role.SUPER_ADMIN, Role.ADMIN])
  async multipleRemove(@Query('ids') ids: string[]) {
    return this.cuisineService.multipleRemove(ids);
  }
}
