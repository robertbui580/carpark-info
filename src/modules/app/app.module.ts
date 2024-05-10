import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigurationModule } from '@src/common/config/configuration.module';
import { SqliteModule } from '@src/common/database/sqlite.module';
import { GuardModule } from '@src/common/guard/guard.module';
import { InterceptorModule } from '@src/common/interceptor/interceptor.module';
import { JsonParseMiddleware } from '@src/common/middleware/json-parse.middleware';
import { PipeModule } from '@src/common/pipe/pipe.module';
import { AuthModule } from '../auth/auth.module';
import { CarparkModule } from '../carpark/carpark.module';
import { FavoriteListModule } from '../favorite-list/favorite-list.module';
import { ScheduleTaskModule } from '../schedule-task/schedule-task.module';
import { UserModule } from '../user/user.module';
import { AppController } from './app.controller';
@Module({
  imports: [
    ConfigurationModule,
    GuardModule,
    InterceptorModule,
    PipeModule,
    SqliteModule,
    AuthModule,
    CarparkModule,
    UserModule,
    FavoriteListModule,
    ScheduleTaskModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JsonParseMiddleware).forRoutes('*');
  }
}
