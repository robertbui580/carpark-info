import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carpark } from '@src/models/carpark.model';
import { CarparkController } from './carpark.controller';
import { CarparkRepository } from './carpark.repository';
import { CarparkService } from './carpark.service';

@Module({
  imports: [TypeOrmModule.forFeature([Carpark])],
  providers: [CarparkRepository, CarparkService],
  controllers: [CarparkController],
  exports: [CarparkService],
})
export class CarparkModule {}
