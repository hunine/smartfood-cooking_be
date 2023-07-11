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
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { AuthorizeGuard } from '@app/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('levels')
@Controller('levels')
export class LevelController {
  constructor(private readonly levelService: LevelService) {}

  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    return this.levelService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.levelService.findOneById(id);
  }

  @Post()
  @AuthorizeGuard([Role.SUPER_ADMIN, Role.ADMIN])
  async create(@Body() createLevelDto: CreateLevelDto) {
    return this.levelService.create(createLevelDto);
  }

  @Patch(':id')
  @AuthorizeGuard([Role.SUPER_ADMIN, Role.ADMIN])
  async update(
    @Param('id') id: string,
    @Body() updateLevelDto: UpdateLevelDto,
  ) {
    return this.levelService.update(id, updateLevelDto);
  }

  @Delete(':id')
  @AuthorizeGuard([Role.SUPER_ADMIN, Role.ADMIN])
  async remove(@Param('id') id: string) {
    return this.levelService.remove(id);
  }

  @Delete()
  @AuthorizeGuard([Role.SUPER_ADMIN, Role.ADMIN])
  async multipleRemove(@Query('ids') ids: string[]) {
    return this.levelService.multipleRemove(ids);
  }
}
