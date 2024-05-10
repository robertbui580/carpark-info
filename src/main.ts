import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { EEnv } from './common/constant/constant';
import { AppModule } from './modules/app/app.module';
import { initializeApp } from './shared/bootstrap';
import { initializeSwagger } from './shared/init-swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  await initializeApp(app);
  initializeSwagger(app);

  const configService = app.get(ConfigService);
  await app.listen(configService.get(EEnv.PORT));
}
bootstrap();
