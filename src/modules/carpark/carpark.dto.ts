import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Carpark } from '@src/models/carpark.model';
import { toNumber } from '@src/shared/util';

export enum FilterOptions {
  YES = 'YES',
  NO = 'NO',
}

export class QueryListCarpark {
  @ApiProperty({ required: false, enum: FilterOptions })
  @IsEnum(['YES', 'NO'])
  @IsString()
  @IsOptional()
  freeParking: string;

  @ApiProperty({ required: false, enum: FilterOptions })
  @IsEnum(['YES', 'NO'])
  @IsString()
  @IsOptional()
  nightParking: string;

  @ApiProperty({ required: false })
  @Transform(({ key, value }) => toNumber(key, value))
  @IsNumber()
  @IsOptional()
  gantryHeight: number;

  @ApiProperty({ required: false })
  @Transform(({ key, value }) => toNumber(key, value))
  @Min(1)
  @IsNumber()
  @IsOptional()
  page: number;

  @ApiProperty({ required: false })
  @Transform(({ key, value }) => toNumber(key, value))
  @Max(100)
  @Min(1)
  @IsNumber()
  @IsOptional()
  limit: number;
}

@Exclude()
export class CarparkDto {
  @ApiProperty()
  @Expose()
  carParkNo: string;

  @ApiProperty()
  @Expose()
  address: string;

  @ApiProperty()
  @Expose()
  xCoord: number;

  @ApiProperty()
  @Expose()
  yCoord: number;

  @ApiProperty()
  @Expose()
  carParkType: string;

  @ApiProperty()
  @Expose()
  typeOfParkingSystem: string;

  @ApiProperty()
  @Expose()
  shortTermParking: string;

  @ApiProperty()
  @Expose()
  freeParking: string;

  @ApiProperty()
  @Expose()
  nightParking: string;

  @ApiProperty()
  @Expose()
  carParkDecks: number;

  @ApiProperty()
  @Expose()
  gantryHeight: number;

  @ApiProperty()
  @Expose()
  carParkBasement: string;

  @ApiProperty()
  @Expose()
  createdAt: string;

  @ApiProperty()
  @Expose()
  updatedAt: string;

  constructor(raw: Partial<Carpark>) {
    Object.assign(this, raw);
  }
}

@Exclude()
export class ListCarparkResponse {
  @ApiProperty({ type: [CarparkDto] })
  @Expose()
  data: CarparkDto[];

  @ApiProperty()
  @Expose()
  total: number;

  constructor(_data: CarparkDto[], _total: number) {
    this.data = _data;
    this.total = _total;
  }
}
