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

@ApiTags('cuisine')
@Controller('cuisine')
export class CuisineController {
  constructor(private readonly cuisineService: CuisineService) {}

  @Get()
  async findAll() {
    return this.cuisineService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.cuisineService.findOneById(id);
  }

  @Post()
  async create(@Body() createCuisineDto: CreateCuisineDto) {
    return this.cuisineService.create(createCuisineDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCuisineDto: UpdateCuisineDto) {
    return this.cuisineService.update(id, updateCuisineDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cuisineService.remove(id);
  }

  @Delete()
  async multipleRemove(@Query('ids') ids: string[]) {
    return this.cuisineService.multipleRemove(ids);
  }
}
