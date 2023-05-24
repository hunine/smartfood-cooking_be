import { Inject, Injectable } from '@nestjs/common';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { Ingredient } from './entities';
import { Repository } from 'typeorm';
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

  update(id: number, updateIngredientDto: UpdateIngredientDto) {
    return `This action updates a #${id} ingredient`;
  }

  remove(id: number) {
    return `This action removes a #${id} ingredient`;
  }
}
