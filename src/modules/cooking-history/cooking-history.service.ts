import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CookingHistoryProvider } from './cooking-history.provider';
import { Repository } from 'typeorm';
import { CookingHistory } from './entities';
import { CreateCookingHistoryDto } from './dto/create-cooking-history.dto';
import { UserService } from '@app/user/user.service';
import { DateTimeHelper } from 'src/helpers/datetime.helper';

@Injectable()
export class CookingHistoryService {
  constructor(
    @Inject(CookingHistoryProvider.REPOSITORY)
    private readonly repository: Repository<CookingHistory>,
    private readonly userService: UserService,
  ) {}

  async create(cookingHistory: CreateCookingHistoryDto) {
    const { userEmail, recipeId } = cookingHistory;

    const isExistUser = await this.userService.findOneByEmail(userEmail);
    if (!isExistUser) {
      throw new NotFoundException('User not found');
    }

    await this.repository.save({
      recipeId,
      userId: isExistUser.id,
      date: DateTimeHelper.getTodayString(),
    });
  }

  async findHistoryByUser(userEmail: string, numOfRecipes = 10) {
    const isExistUser = await this.userService.findOneByEmail(userEmail);
    if (!isExistUser) {
      throw new NotFoundException('User not found');
    }

    const cookingHistory = await this.repository.find({
      where: { userId: isExistUser.id },
      order: { createdAt: 'DESC' },
      take: numOfRecipes,
    });

    return cookingHistory;
  }

  async getRecipesStatistics(from: string, to: string) {
    const recipesStatistics = await this.repository
      .createQueryBuilder('cookingHistory')
      .select('cookingHistory.date', 'date')
      .addSelect('COUNT(cookingHistory.date)', 'count')
      .where('cookingHistory.date BETWEEN :from AND :to', { from, to })
      .groupBy('cookingHistory.date')
      .orderBy('date', 'DESC')
      .getRawMany();
    const dateMapping = {};

    recipesStatistics.forEach((item) => {
      dateMapping[item.date] = item.count;
    });

    for (
      let d = new Date(from);
      d <= new Date(to);
      d.setDate(d.getDate() + 1)
    ) {
      if (!dateMapping[d.toISOString().slice(0, 10)]) {
        recipesStatistics.push({
          date: d.toISOString().slice(0, 10),
          count: 0,
        });
      }
    }

    return recipesStatistics
      .map((item) => {
        return {
          date: item.date,
          count: Number.parseInt(item.count),
        };
      })
      .sort((a, b) => {
        return a.date > b.date ? 1 : -1;
      });
  }
}
