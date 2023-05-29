import { Inject, Injectable } from '@nestjs/common';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { Ingredient } from './entities';
import { In, Repository } from 'typeorm';
import { IngredientProvider } from './ingredient.provider';

@Injectable()
export class IngredientService {
  constructor(
    @Inject(IngredientProvider.REPOSITORY)
    private readonly repository: Repository<Ingredient>,
  ) {}

  async create(createIngredientDto: CreateIngredientDto): Promise<Ingredient> {
    const ingredient: Ingredient = this.repository.create(createIngredientDto);
    return this.repository.save(ingredient);
  }

  async findAll(): Promise<Ingredient[]> {
    return this.repository.find();
  }

  async findOneById(id: string): Promise<Ingredient> {
    return this.repository.findOneByOrFail({ id });
  }

  async update(id: string, updateIngredientDto: UpdateIngredientDto) {
    try {
      return this.repository.save({
        id,
        ...updateIngredientDto,
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const ingredient: Ingredient = await this.findOneById(id);
      return this.repository.softRemove(ingredient);
    } catch (error) {
      throw error;
    }
  }

  async multipleRemove(ids: string[]) {
    if (!(ids instanceof Array)) {
      ids = [ids];
    }

    try {
      const ingredients: Ingredient[] = await this.repository.find({
        where: {
          id: In(ids),
        },
      });

      return this.repository.softRemove(ingredients);
    } catch (error) {
      throw error;
    }
  }
}
