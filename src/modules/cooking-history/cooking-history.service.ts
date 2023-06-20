import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CookingHistoryProvider } from './cooking-history.provider';
import { Repository } from 'typeorm';
import { CookingHistory } from './entities';
import { CreateCookingHistoryDto } from './dto/create-cooking-history.dto';
import { UserService } from '@app/user/user.service';

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
    });
  }
}
