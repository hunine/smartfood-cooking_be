import { Controller, Get, UseFilters, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExerciseService } from './exercise.service';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { HttpExceptionFilter } from 'src/core/filters/http-exception.filter';
import { LoggingInterceptor } from 'src/core/interceptors/logging.interceptor';
import { TransformInterceptor } from 'src/core/interceptors/transform.interceptor';

@ApiTags('exercises')
@Controller('exercises')
@UseFilters(new HttpExceptionFilter())
@UseInterceptors(LoggingInterceptor, TransformInterceptor)
export class ExerciseController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    return this.exerciseService.findAll(query);
  }
}
