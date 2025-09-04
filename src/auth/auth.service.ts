import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserRepository } from '../user/repositorys/user.repository';
import { UserDocument } from '../user/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepo: UserRepository,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<Partial<UserDocument> | null> {
    const user = await this.userRepo.findByUsername(username);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    const { ...result } = user.toObject();
    return result;
  }

  login(user: Partial<UserDocument>) {
    const payload = { username: user.username, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
