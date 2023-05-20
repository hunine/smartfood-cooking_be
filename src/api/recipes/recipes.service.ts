import { Inject, Injectable } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';
import { Repository } from 'typeorm';
import { LevelsService } from '@api/levels/levels.service';
import { Level } from '@api/levels/entities';

@Injectable()
export class RecipesService {
  @InjectRepository(Recipe) private readonly repository: Repository<Recipe>;
  @Inject(LevelsService) private readonly levelService: LevelsService;

  async create(createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    const level: Level = await this.levelService.findOneById(
      createRecipeDto.levelId
    );
    const recipe: Recipe = this.repository.create({
      ...createRecipeDto,
      level,
    });

    return this.repository.save(recipe);
  }

  async findAll(): Promise<Recipe[]> {
    return this.repository.find({
      relations: ['level'],
    });
  }

  async findOne(id: string): Promise<Recipe> {
    return this.repository.findOneBy({ id });
  }

  update(id: number, updateRecipeDto: UpdateRecipeDto) {
    return `This action updates a #${id} recipe`;
  }

  remove(id: number) {
    return `This action removes a #${id} recipe`;
  }
}
