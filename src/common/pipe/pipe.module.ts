import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

import { CustomValidationPipe } from './validation.pipe';

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useClass: CustomValidationPipe,
    },
  ],
})
export class PipeModule {}
