import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { UnauthorizedException } from '@nestjs/common/exceptions';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  auth(user: User) {
    const payload = { sub: user.id };
    console.log(user.id);
    return { access_token: this.jwtService.sign(payload) };
  }

  async validatePassword(username: string, pass: string) {
    const user = await this.usersService.findByUsername(username);

    if (!user || user.password !== pass) {
      throw new UnauthorizedException('Неправильный логин или пароль');
    }
    const { password, ...result } = user;
    return result;
  }
}
