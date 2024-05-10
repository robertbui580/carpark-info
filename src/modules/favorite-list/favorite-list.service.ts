import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CarparkService } from '../carpark/carpark.service';
import { UserService } from '../user/user.service';
import {
  AddFavoriteCarpark,
  FavoriteListCarpark,
  FavoriteListResponse,
  ListFavoriteCarpark,
} from './favorite-list.dto';
import { FavoriteListRepository } from './favorite-list.repository';

@Injectable()
export class FavoriteListService {
  constructor(
    private readonly favoriteListRepository: FavoriteListRepository,
    private readonly userService: UserService,
    private readonly carparkService: CarparkService,
  ) {}

  async addNewFavoriteCarpark(userId: number, data: AddFavoriteCarpark) {
    const user = await this.userService.findOneWithCondition({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const carpark = await this.carparkService.findOneWithCondition({
      where: {
        carParkNo: data.carParkNo,
      },
    });
    if (!carpark) {
      throw new NotFoundException('Carpark not found');
    }

    const existingFavoriteCarpark = await this.favoriteListRepository.findOneWithCondition({
      where: {
        userId: user.id,
        carParkNoId: carpark.carParkNo,
      },
    });
    if (existingFavoriteCarpark) {
      throw new BadRequestException('Existing favorite carpark');
    }

    return this.favoriteListRepository.addNewFavoriteCarpark(user.id, carpark.carParkNo);
  }

  async getMyFavoriteCarpark(userId: number, query: ListFavoriteCarpark) {
    const { page = 1, limit = 20 } = query;
    const [data, total] = await this.favoriteListRepository.findAndCount({
      where: {
        userId: userId,
      },
      relations: ['carpark'],
      skip: (page - 1) * limit,
      take: limit,
    });

    const transformData = data.map((item) => new FavoriteListCarpark(item));
    return new FavoriteListResponse(transformData, total);
  }

  async deleteAFavoriteCarpark(userId: number, id: number) {
    const favoriteCarpark = await this.favoriteListRepository.findOneWithCondition({
      where: {
        id: +id,
        userId: userId,
      },
    });
    if (!favoriteCarpark) {
      throw new NotFoundException('Favorite carpark not found');
    }

    return this.favoriteListRepository.removeEntity(favoriteCarpark);
  }
}
