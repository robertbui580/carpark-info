import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      logging: true,
      entities: ['dist/models/*.model.js'],
      synchronize: true,
    }),
  ],
})
export class SqliteModule {}
