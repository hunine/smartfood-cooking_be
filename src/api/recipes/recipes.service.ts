import { Injectable } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RecipesService {
  @InjectRepository(Recipe)
  private readonly repository: Repository<Recipe>;

  async create(createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    const recipe: Recipe = this.repository.create(createRecipeDto);
    return this.repository.save(recipe);
  }

  findAll(): Promise<Recipe[]> {
    return this.repository.find();
  }

  findOne(id: string): Promise<Recipe> {
    return this.repository.findOneBy({ id });
  }

  update(id: number, updateRecipeDto: UpdateRecipeDto) {
    return `This action updates a #${id} recipe`;
  }

  remove(id: number) {
    return `This action removes a #${id} recipe`;
  }
}
