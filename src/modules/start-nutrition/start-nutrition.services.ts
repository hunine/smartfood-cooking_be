import { Inject, Injectable } from '@nestjs/common';
import { StartNutritionProvider } from './start-nutrition.provider';
import { StartNutrition } from './entities';
import { Repository } from 'typeorm';
import { CreateStartNutritionDto } from './dto/create-start-nutrition.dto';

@Injectable()
export class StartNutritionService {
  constructor(
    @Inject(StartNutritionProvider.REPOSITORY)
    private readonly repository: Repository<StartNutrition>,
  ) {}

  async create(createStartNutritionDto: CreateStartNutritionDto) {
    const startNutrition = await this.repository.find({
      where: { userId: createStartNutritionDto.userId },
    });

    if (startNutrition.length > 0) {
      await this.repository.save(createStartNutritionDto);
    }
  }
}
