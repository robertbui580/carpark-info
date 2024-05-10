import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@src/models/user.model';
import { FindOneOptions } from 'typeorm';
import { AuthRegisterResponse } from '../auth/auth.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  findOneWithCondition(options: FindOneOptions<User>) {
    return this.userRepository.findOneWithCondition(options);
  }

  createNewUser(user: Partial<User>) {
    return this.userRepository.createNewUser(user);
  }

  async getUserInfo(userId: number) {
    const user = await this.findOneWithCondition({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return new AuthRegisterResponse(user);
  }
}
