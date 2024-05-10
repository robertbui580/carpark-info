import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { Carpark } from '@src/models/carpark.model';
import { getDataFromCsv } from '@src/shared/util';
import { FindOneOptions } from 'typeorm';
import { getExecuteFile } from '../schedule-task/schedule-task.util';
import { CarparkDto, ListCarparkResponse, QueryListCarpark } from './carpark.dto';
import { RawCarparkData } from './carpark.interface';
import { CarparkRepository } from './carpark.repository';

@Injectable()
export class CarparkService {
  constructor(private readonly carparkRepo: CarparkRepository) {}

  findOneWithCondition(options: FindOneOptions<Carpark>) {
    return this.carparkRepo.findOneWithCondition(options);
  }

  async initDatabase() {
    const folderPath = join(__dirname, '../../../data');
    const file = getExecuteFile(folderPath);
    const filePath = join(folderPath, '/', file);

    const data: RawCarparkData[] = await getDataFromCsv(filePath);
    const ormData: Partial<Carpark>[] = data.map((item) => ({
      carParkNo: item.car_park_no,
      address: item.address,
      xCoord: +item.x_coord || 0.0,
      yCoord: +item.y_coord || 0.0,
      carParkType: item.car_park_type,
      typeOfParkingSystem: item.type_of_parking_system,
      shortTermParking: item.short_term_parking,
      freeParking: item.free_parking,
      nightParking: item.night_parking,
      carParkDecks: +item.car_park_decks || 0,
      gantryHeight: +item.gantry_height || 0,
      carParkBasement: item.car_park_basement,
    }));
    const listCarparkNo = ormData.map((item) => item.carParkNo);

    return this.carparkRepo.initDatabase(ormData, listCarparkNo);
  }

  async dailySynchronizeDatabase(data: RawCarparkData[]) {
    const allCarParkNo = await this.carparkRepo.find({
      select: ['carParkNo'],
    });
    const ormData: Partial<Carpark>[] = data.map((item) => {
      return {
        carParkNo: item.car_park_no,
        address: item.address,
        xCoord: +item.x_coord || 0.0,
        yCoord: +item.y_coord || 0.0,
        carParkType: item.car_park_type,
        typeOfParkingSystem: item.type_of_parking_system,
        shortTermParking: item.short_term_parking,
        freeParking: item.free_parking,
        nightParking: item.night_parking,
        carParkDecks: +item.car_park_decks || 0,
        gantryHeight: +item.gantry_height || 0,
        carParkBasement: item.car_park_basement,
      };
    });
    const listUpsertCarparkNo = ormData.map((item) => item.carParkNo);

    const listDeletedCarparkNo = [];
    for (const item of allCarParkNo) {
      if (!listUpsertCarparkNo.includes(item.carParkNo)) {
        listDeletedCarparkNo.push(item.carParkNo);
      }
    }
    return this.carparkRepo.dailySynchronizeDatabase(ormData, listDeletedCarparkNo);
  }

  async getListCarpark(query: QueryListCarpark) {
    const [data, total] = await this.carparkRepo.getListCarpark(query);

    const transformData = data.map((item) => new CarparkDto(item));
    return new ListCarparkResponse(transformData, total);
  }
}
