import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';

function writeSwaggerJson(path: string, document) {
  const swaggerFile = `${path}/swagger.json`;
  fs.writeFileSync(swaggerFile, JSON.stringify(document, null, 2), {
    encoding: 'utf8',
  });
}

export function initializeSwagger(app: INestApplication) {
  const server = app.getHttpAdapter();
  const options = new DocumentBuilder()
    .setTitle('Carpark Info API')
    .setDescription('API specification for Carpark Info Service | [swagger.json](swagger.json)')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  writeSwaggerJson(`${process.cwd()}`, document);

  server.get('/docs/swagger.json', (req, res) => {
    res.json(document);
  });
  SwaggerModule.setup('/docs/carpark-info', app, document, {
    swaggerOptions: {
      displayRequestDuration: true,
    },
  });
}
