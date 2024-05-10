import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ETable } from '@src/common/constant/constant';
import { Carpark } from '@src/models/carpark.model';
import { Brackets, DataSource, FindManyOptions, FindOneOptions, In, Not, Repository } from 'typeorm';
import { FilterOptions, QueryListCarpark } from './carpark.dto';

@Injectable()
export class CarparkRepository {
  private readonly logger = new Logger(CarparkRepository.name);

  constructor(
    private dataSource: DataSource,
    @InjectRepository(Carpark)
    private readonly carparkRepository: Repository<Carpark>,
  ) {}

  findOneWithCondition(options: FindOneOptions<Carpark>) {
    return this.carparkRepository.findOne(options);
  }

  find(options?: FindManyOptions<Carpark>) {
    return this.carparkRepository.find(options);
  }

  async initDatabase(data: Partial<Carpark>[], listCarparkNo: string[]) {
    this.logger.log('======= Start Init Database =======');
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.carparkRepository.save(data, { chunk: 200 });
      await this.carparkRepository.delete({
        carParkNo: Not(In(listCarparkNo)),
      });

      await queryRunner.commitTransaction();
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    this.logger.log('======= Init Database Done =======');
  }

  async dailySynchronizeDatabase(data: Partial<Carpark>[], deletedCarparkNo: string[]) {
    this.logger.log('---------- dailySynchronizeDatabase: Start');
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.carparkRepository.save(data, { chunk: 200 });
      await this.carparkRepository.delete({
        carParkNo: In(deletedCarparkNo),
      });
      await queryRunner.commitTransaction();
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
    this.logger.log('---------- dailySynchronizeDatabase: Successful');
  }

  async getListCarpark(query: QueryListCarpark) {
    const { page = 1, limit = 20, freeParking, nightParking, gantryHeight } = query;

    const queryBuilder = this.carparkRepository.createQueryBuilder(ETable.Carpark);
    queryBuilder.where(`${ETable.Carpark}.carParkNo IS NOT NULL`);

    if (freeParking === FilterOptions.YES) {
      queryBuilder.andWhere(`${ETable.Carpark}.freeParking != :param`, { param: 'NO' });
    } else if (freeParking === FilterOptions.NO) {
      queryBuilder.andWhere(`${ETable.Carpark}.freeParking = :param`, { param: 'NO' });
    }

    if (nightParking) {
      queryBuilder.andWhere(`${ETable.Carpark}.nightParking = :nightParking`, {
        nightParking,
      });
    }

    if (gantryHeight) {
      queryBuilder.andWhere(
        new Brackets((subQuery) => {
          subQuery
            .where(`${ETable.Carpark}.gantryHeight = 0`)
            .orWhere(`${ETable.Carpark}.gantryHeight >= :gantryHeight`, {
              gantryHeight,
            });
        }),
      );
    }

    queryBuilder.skip((page - 1) * limit);
    queryBuilder.take(limit);

    return queryBuilder.getManyAndCount();
  }
}
