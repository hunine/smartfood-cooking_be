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
import { LevelService } from './level.service';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('levels')
@Controller('levels')
export class LevelController {
  constructor(private readonly levelService: LevelService) {}

  @Get()
  async findAll() {
    return this.levelService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.levelService.findOneById(id);
  }

  @Post()
  async create(@Body() createLevelDto: CreateLevelDto) {
    return this.levelService.create(createLevelDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateLevelDto: UpdateLevelDto,
  ) {
    return this.levelService.update(id, updateLevelDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.levelService.remove(id);
  }

  @Delete()
  async multipleRemove(@Query('ids') ids: string[]) {
    return this.levelService.multipleRemove(ids);
  }
}
