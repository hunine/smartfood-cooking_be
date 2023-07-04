import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UserProvider } from './user.provider';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { User } from './entities';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserStatDto } from './dto/update-user-stat.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RESPONSE_MESSAGES } from 'src/common/constants';
import {
  FilterOperator,
  FilterSuffix,
  Paginate,
  PaginateQuery,
  Paginated,
  paginate,
} from 'nestjs-paginate';
import { DateTimeHelper } from 'src/helpers/datetime.helper';
import { UpdateUserDto } from './dto/update-user.dto';
import { StartNutritionService } from '@app/start-nutrition/start-nutrition.services';
import { StartNutrition } from '@app/start-nutrition/entities';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserProvider.REPOSITORY)
    private readonly repository: Repository<User>,
    private readonly startNutritionService: StartNutritionService,
  ) {}

  async findOneByEmail(
    email: string,
    options = { getPassword: false },
  ): Promise<User> {
    const user = await this.repository.findOne({
      relations: ['avatar'],
      where: { email },
    });

    if (user && !options.getPassword) {
      delete user.password;
    }

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const isExistUser = await this.findOneByEmail(createUserDto.email, {
      getPassword: false,
    });

    if (isExistUser) {
      throw new HttpException(
        RESPONSE_MESSAGES.USER.EMAIL_EXIST,
        HttpStatus.FORBIDDEN,
      );
    }

    const user: User = this.repository.create(createUserDto);
    return this.repository.save(user);
  }

  async updateInfo(email: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.repository.findOneByOrFail({ email });
    const newUser = {
      ...user,
      ...updateUserDto,
    };

    return this.repository.save(newUser);
  }

  async updateStat(
    email: string,
    updateUserStatDto: UpdateUserStatDto,
  ): Promise<User> {
    try {
      let newUser;

      this.repository.manager.transaction(async (manager) => {
        const user = await manager.findOneByOrFail(User, { email });
        newUser = await manager.save(User, {
          ...user,
          ...updateUserStatDto,
        });

        const startNutrition = await manager.find(StartNutrition, {
          where: { userId: newUser.id },
        });

        if (startNutrition.length === 0) {
          await manager.save(StartNutrition, {
            userId: newUser.id,
            date: DateTimeHelper.getTodayString(),
          });
        }
      });

      return newUser;
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(email: string, resetPasswordDto: ResetPasswordDto) {
    return this.repository.save({
      email,
      ...resetPasswordDto,
    });
  }

  async changePassword(email: string, password: string) {
    const user = await this.findOneByEmail(email, { getPassword: true });

    user.password = password;
    return this.repository.save(user);
  }

  async remove(email: string) {
    const user: User = await this.findOneByEmail(email);
    return this.repository.softRemove(user);
  }

  async findAll(@Paginate() query: PaginateQuery): Promise<Paginated<User>> {
    return paginate(query, this.repository, {
      sortableColumns: ['id', 'firstName', 'lastName', 'email'],
      nullSort: 'last',
      defaultSortBy: [['id', 'DESC']],
      searchableColumns: ['firstName', 'lastName', 'email'],
      select: ['id', 'firstName', 'lastName', 'email', 'deletedAt'],
      filterableColumns: {
        firstName: [FilterOperator.EQ, FilterOperator.ILIKE, FilterSuffix.NOT],
        lastName: [FilterOperator.EQ, FilterOperator.ILIKE, FilterSuffix.NOT],
        email: [FilterOperator.EQ, FilterOperator.ILIKE, FilterSuffix.NOT],
      },
    });
  }

  async countAll() {
    try {
      const totalUsers = await this.repository.count();
      const newUsersLastWeek = await this.repository.count({
        where: {
          createdAt: MoreThanOrEqual(await DateTimeHelper.getLastWeeksDate()),
        },
      });

      return {
        totalUsers,
        newUsersLastWeek,
      };
    } catch (error) {
      throw error;
    }
  }
}
