import { INestApplication } from '@nestjs/common';
import { urlencoded } from 'express';
import helmet from 'helmet';
import { CarparkService } from '@src/modules/carpark/carpark.service';

export async function initializeApp(app: INestApplication) {
  app.use(urlencoded({ extended: true, limit: '10mb' }));
  app.use(helmet());
  app.enableCors({ origin: '*', allowedHeaders: '*' });
  app.setGlobalPrefix('/api/carpark-info');

  // Run init database
  const carparkService = app.get(CarparkService);
  await carparkService.initDatabase();
}
