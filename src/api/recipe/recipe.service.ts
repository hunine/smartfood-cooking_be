import { Inject, Injectable } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';
import { In, Repository } from 'typeorm';
import { LevelService } from '@api/level/level.service';
import { Level } from '@api/level/entities';
import { Category } from '@api/category/entities';
import { CategoryService } from '@api/category/category.service';
import { CuisineService } from '@api/cuisine/cuisine.service';
import { Cuisine } from '@api/cuisine/entities';

@Injectable()
export class RecipeService {
  @InjectRepository(Recipe) private readonly repository: Repository<Recipe>;
  @Inject(LevelService) private readonly levelService: LevelService;
  @Inject(CategoryService) private readonly categoryService: CategoryService;
  @Inject(CuisineService) private readonly cuisineService: CuisineService;

  async create(createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    const level: Level = await this.levelService.findOneById(
      createRecipeDto.levelId,
    );
    const category: Category = await this.categoryService.findOneById(
      createRecipeDto.categoryId,
    );
    const cuisine: Cuisine = await this.cuisineService.findOneById(
      createRecipeDto.cuisineId,
    );

    const recipe: Recipe = this.repository.create({
      ...createRecipeDto,
      level,
      cuisine,
      category,
    });

    return this.repository.save(recipe);
  }

  async findAll(): Promise<Recipe[]> {
    return this.repository.find({
      relations: ['level', 'category', 'cuisine', 'media'],
    });
  }

  async findOneById(id: string): Promise<Recipe> {
    return this.repository.findOneOrFail({
      relations: [
        'level',
        'media',
        'cuisine',
        'category',
        'quantification',
        'quantification.ingredient',
      ],
      where: { id },
    });
  }

  async findByIngredientIds(ids: string[]) {
    if (!(ids instanceof Array)) {
      ids = [ids];
    }

    return this.repository.find({
      relations: [
        'level',
        'category',
        'cuisine',
        'quantification',
        'quantification.ingredient',
      ],
      where: {
        quantification: {
          ingredient: {
            id: In(ids),
          },
        },
      },
    });
  }

  update(id: number, updateRecipeDto: UpdateRecipeDto) {
    return `This action updates a #${id} recipe`;
  }

  remove(id: number) {
    return `This action removes a #${id} recipe`;
  }
}
