import { BadRequestException } from '@nestjs/common';
import { TransformFnParams } from 'class-transformer';
import * as csv from 'csvtojson';

export const toTrimString = ({ value }: TransformFnParams): string => {
  return value ? value.trim() : value;
};

export const toNumber = (key: string, value: string): number => {
  const newValue: number = Number.parseFloat(value);

  if (Number.isNaN(newValue)) {
    throw new BadRequestException(`${key} must be a number`);
  }

  return newValue;
};

export async function getDataFromCsv(path: string) {
  return csv().fromFile(path);
}
