import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  UseFilters,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import {
  ResponseError,
  ResponseSuccess,
} from 'src/core/responses/response-exception';
import { RESPONSE_MESSAGES } from 'src/common/constants';
import { AuthorizeGuard } from '@app/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';
import { HttpExceptionFilter } from 'src/core/filters/http-exception.filter';
import { LoggingInterceptor } from 'src/core/interceptors/logging.interceptor';
import { TransformInterceptor } from 'src/core/interceptors/transform.interceptor';
import { response } from 'express';

@ApiTags('ingredients')
@Controller('ingredients')
@UseFilters(new HttpExceptionFilter())
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Get('count')
  @AuthorizeGuard([Role.SUPER_ADMIN, Role.ADMIN])
  async countAll(@Res() response) {
    try {
      const data = await this.ingredientService.countAll();
      return new ResponseSuccess(
        RESPONSE_MESSAGES.INGREDIENT.GET_INGREDIENT_SUCCESS,
        data,
        true,
      ).toOkResponse(response);
    } catch (error) {
      return new ResponseError(
        RESPONSE_MESSAGES.INGREDIENT.GET_INGREDIENT_ERROR,
        error,
      ).sendResponse(response);
    }
  }

  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    return this.ingredientService.findAll(query);
  }

  @Get('all')
  @AuthorizeGuard([Role.SUPER_ADMIN, Role.ADMIN])
  async findAllWithoutPagination() {
    return this.ingredientService.findAllWithoutPagination();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ingredientService.findOneById(id);
  }

  @Post()
  @AuthorizeGuard([Role.SUPER_ADMIN, Role.ADMIN])
  async create(
    @Res() response,
    @Body() createIngredientDto: CreateIngredientDto,
  ) {
    try {
      const data = this.ingredientService.create(createIngredientDto);

      return new ResponseSuccess(
        RESPONSE_MESSAGES.INGREDIENT.CREATE_INGREDIENT_SUCCESS,
        data,
        true,
      ).toNoContentResponse(response);
    } catch (error) {
      return new ResponseError(
        RESPONSE_MESSAGES.INGREDIENT.CREATE_INGREDIENT_ERROR,
        error,
      ).sendResponse(response);
    }
  }

  @Patch(':id')
  @AuthorizeGuard([Role.SUPER_ADMIN, Role.ADMIN])
  async update(
    @Res() response,
    @Param('id') id: string,
    @Body() updateIngredientDto: UpdateIngredientDto,
  ) {
    try {
      const data = await this.ingredientService.update(id, updateIngredientDto);

      return new ResponseSuccess(
        RESPONSE_MESSAGES.INGREDIENT.UPDATE_INGREDIENT_SUCCESS,
        data,
        true,
      ).toNoContentResponse(response);
    } catch (error) {
      return new ResponseError(
        RESPONSE_MESSAGES.INGREDIENT.UPDATE_INGREDIENT_ERROR,
        error,
      ).sendResponse(response);
    }
  }

  @Delete(':id')
  @AuthorizeGuard([Role.SUPER_ADMIN, Role.ADMIN])
  async remove(@Param('id') id: string) {
    return this.ingredientService.remove(id);
  }

  @Delete()
  @AuthorizeGuard([Role.SUPER_ADMIN, Role.ADMIN])
  async multipleRemove(@Query('ids') ids: string[]) {
    return this.ingredientService.multipleRemove(ids);
  }
}
