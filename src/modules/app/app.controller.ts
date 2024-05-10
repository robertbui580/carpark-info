import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PublicApi } from '@src/common/guard/guard.decorator';

@Controller()
@ApiTags('Health Check')
export class AppController {
  constructor() {}

  @Get()
  @ApiOperation({
    operationId: 'ping',
    description: 'Health Check',
  })
  @PublicApi()
  ping(): string {
    return 'Pong';
  }
}
