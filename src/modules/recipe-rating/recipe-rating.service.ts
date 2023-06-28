import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RecipeRatingProvider } from './recipe-rating.provider';
import { RecipeRating } from './entities';
import { Repository } from 'typeorm';
import { CreateRecipeRatingDto } from './dto/create-recipe-rating.dto';
import { Rating } from 'src/common/enums/rating.enum';
import { Recipe } from '@app/recipe/entities';

@Injectable()
export class RecipeRatingService {
  constructor(
    @Inject(RecipeRatingProvider.REPOSITORY)
    private readonly repository: Repository<RecipeRating>,
  ) {}

  async create(
    createRecipeRatingDto: CreateRecipeRatingDto,
  ): Promise<RecipeRating> {
    try {
      const { recipeId, userId, value } = createRecipeRatingDto;

      if (value < Rating.MIN || value > Rating.MAX) {
        throw new BadRequestException(
          `Rating value must be between ${Rating.MIN} and ${Rating.MAX}`,
        );
      }

      await this.repository.manager.transaction(async (manager) => {
        const isExist = await manager.findOne(RecipeRating, {
          where: { recipe: { id: recipeId }, user: { id: userId } },
        });

        if (isExist) {
          await manager.update(
            RecipeRating,
            { recipe: { id: recipeId }, user: { id: userId } },
            { value },
          );
        } else {
          await manager.save(RecipeRating, {
            recipe: {
              id: recipeId,
            },
            user: {
              id: userId,
            },
            value,
          });
        }

        const recipeRating = await manager.average(RecipeRating, 'value', {
          recipe: {
            id: recipeId,
          },
        });

        console.log(recipeRating);

        await manager.save(Recipe, {
          id: recipeId,
          rating: recipeRating,
        });
      });

      return this.repository.findOne({
        where: {
          recipe: {
            id: recipeId,
          },
          user: {
            id: userId,
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
