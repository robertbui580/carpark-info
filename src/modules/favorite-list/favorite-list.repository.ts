import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FavoriteList } from '@src/models/favorite-list.model';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class FavoriteListRepository {
  constructor(
    @InjectRepository(FavoriteList)
    private favoriteListRepo: Repository<FavoriteList>,
  ) {}

  findOneWithCondition(options: FindOneOptions<FavoriteList>) {
    return this.favoriteListRepo.findOne(options);
  }

  findAndCount(options?: FindManyOptions<FavoriteList>) {
    return this.favoriteListRepo.findAndCount(options);
  }

  removeEntity(entity: FavoriteList) {
    return this.favoriteListRepo.remove(entity);
  }

  addNewFavoriteCarpark(userId: number, carParkNo: string) {
    const newFavoriteCarpark: Partial<FavoriteList> = {
      carParkNoId: carParkNo,
      userId: userId,
    };
    return this.favoriteListRepo.save(newFavoriteCarpark);
  }
}
