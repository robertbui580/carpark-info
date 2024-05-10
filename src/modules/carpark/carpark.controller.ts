import { ClassSerializerInterceptor, Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QueryListCarpark } from './carpark.dto';
import { CarparkService } from './carpark.service';

@Controller('carpark')
@ApiTags('Carpark')
@ApiBearerAuth()
export class CarparkController {
  constructor(private readonly carparkService: CarparkService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  getList(@Query() query: QueryListCarpark) {
    return this.carparkService.getListCarpark(query);
  }
}
