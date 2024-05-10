import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform, Type, ValidationPipe } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

function toValidate(metatype: Function): boolean {
  const types: Function[] = [String, Boolean, Number, Array, Object];
  return !types.includes(metatype);
}

function findError(currentNode) {
  const node = currentNode[0];
  if (node?.constraints) {
    throw new BadRequestException(node.constraints[Object.keys(node.constraints)[0]]);
  }
  findError(node?.children);
}

@Injectable()
export class CustomValidationPipe extends ValidationPipe implements PipeTransform<any> {
  constructor() {
    super({ whitelist: true, transform: true });
  }

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      if (errors[0].constraints) {
        throw new BadRequestException(errors[0].constraints[Object.keys(errors[0].constraints)[0]]);
      } else if (errors[0].children.length > 0) {
        findError(errors[0].children);
      }
    }

    return object;
  }
}
