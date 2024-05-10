import { Module } from '@nestjs/common';
import { FavoriteListService } from './favorite-list.service';
import { FavoriteListController } from './favorite-list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { FavoriteListRepository } from './favorite-list.repository';
import { CarparkModule } from '../carpark/carpark.module';
import { FavoriteList } from '@src/models/favorite-list.model';

@Module({
  imports: [TypeOrmModule.forFeature([FavoriteList]), UserModule, CarparkModule],
  providers: [FavoriteListService, FavoriteListRepository],
  controllers: [FavoriteListController],
  exports: [FavoriteListService],
})
export class FavoriteListModule {}
