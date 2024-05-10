import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { EEnv } from '../constant/constant';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        [EEnv.NODE_ENV]: Joi.string().default('development'),
        [EEnv.PORT]: Joi.number().default(3000),
        [EEnv.BCRYPT_SALT_ROUNDS]: Joi.number().default(14),
        [EEnv.JWT_SECRET_KEY]: Joi.string().required(),
        [EEnv.JWT_REFRESH_KEY]: Joi.string().required(),
      }),
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigurationModule {}
