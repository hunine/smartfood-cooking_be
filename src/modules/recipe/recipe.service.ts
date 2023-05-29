import { Inject, Injectable } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Recipe } from './entities/recipe.entity';
import { In, Repository } from 'typeorm';
import { LevelService } from 'src/modules/level/level.service';
import { Level } from 'src/modules/level/entities';
import { Category } from 'src/modules/category/entities';
import { CategoryService } from 'src/modules/category/category.service';
import { CuisineService } from 'src/modules/cuisine/cuisine.service';
import { Cuisine } from 'src/modules/cuisine/entities';
import { RecipeProvider } from './recipe.provider';

@Injectable()
export class RecipeService {
  constructor(
    @Inject(RecipeProvider.REPOSITORY)
    private readonly repository: Repository<Recipe>,
    private readonly levelService: LevelService,
    private readonly categoryService: CategoryService,
    private readonly cuisineService: CuisineService,
  ) {}

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

  async update(id: string, updateRecipeDto: UpdateRecipeDto) {
    try {
      return this.repository.save({
        id,
        ...updateRecipeDto,
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const recipe: Recipe = await this.findOneById(id);
      return this.repository.softRemove(recipe);
    } catch (error) {
      throw error;
    }
  }

  async multipleRemove(ids: string[]) {
    if (!(ids instanceof Array)) {
      ids = [ids];
    }

    try {
      const recipes: Recipe[] = await this.repository.find({
        where: {
          id: In(ids),
        },
      });

      return this.repository.softRemove(recipes);
    } catch (error) {
      throw error;
    }
  }
}
