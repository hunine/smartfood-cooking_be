import { Inject, Injectable } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';
import { Repository } from 'typeorm';
import { LevelService } from '@api/level/level.service';
import { Level } from '@api/level/entities';

@Injectable()
export class RecipeService {
  @InjectRepository(Recipe) private readonly repository: Repository<Recipe>;
  @Inject(LevelService) private readonly levelService: LevelService;

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

  async findOneById(id: string): Promise<Recipe> {
    return this.repository.findOneBy({ id });
  }

  update(id: number, updateRecipeDto: UpdateRecipeDto) {
    return `This action updates a #${id} recipe`;
  }

  remove(id: number) {
    return `This action removes a #${id} recipe`;
  }
}
