import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UserProvider } from './user.provider';
import { Repository } from 'typeorm';
import { User } from './entities';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RESPONSE_MESSAGES } from 'src/common/constants';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserProvider.REPOSITORY)
    private readonly repository: Repository<User>,
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

  async update(email: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.repository.findOneByOrFail({ email });
    const newUser = {
      ...user,
      ...updateUserDto,
    };

    return this.repository.save(newUser);
  }

  async resetPassword(email: string, resetPasswordDto: ResetPasswordDto) {
    return this.repository.save({
      email,
      ...resetPasswordDto,
    });
  }

  async remove(email: string) {
    const user: User = await this.findOneByEmail(email);
    return this.repository.softRemove(user);
  }
}
