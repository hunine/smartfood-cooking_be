import { UserService } from '@app/user/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compareHashString, hashString } from 'src/common/ultis/bcrypt';
import { ValidateAuthDto } from './dto/validate-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { AccessToken } from 'src/common/interfaces/access-token.interface';
import { CreateUserDto } from '@app/user/dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private generateAccessToken(user) {
    const payload = { user };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async validateLogin(validateAuthDto: ValidateAuthDto): Promise<AccessToken> {
    const { email, password } = validateAuthDto;
    const user = await this.userService.findOneByEmail(email, {
      getPassword: true,
    });

    if (!user || !compareHashString(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    delete user.password;

    return this.generateAccessToken(user);
  }

  async register(createUserDto: CreateUserDto) {
    createUserDto.password = hashString(createUserDto.password);
    const user = await this.userService.create(createUserDto);

    return this.generateAccessToken(user);
  }

  async changePassword(email: string, changePasswordDto: ChangePasswordDto) {
    try {
      const { currentPassword, newPassword, confirmPassword } =
        changePasswordDto;
      const user = await this.userService.findOneByEmail(email, {
        getPassword: true,
      });

      if (!user || !compareHashString(currentPassword, user.password)) {
        throw new UnauthorizedException('Old password is not correct');
      }

      if (newPassword !== confirmPassword) {
        throw new UnauthorizedException('Confirm password is not correct');
      }

      await this.userService.changePassword(email, hashString(newPassword));
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
