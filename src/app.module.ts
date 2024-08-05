import { Module, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from '@/common/logger/logger.middleware';
import { AppController } from '@/app.controller';
import { AppService } from '@//app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@/common/database/database.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from '@/common/auth/auth.module';
import { RequestLoggerInterceptor } from '@/common/interceptor/request-logger.interceptor';
import { HealthModule } from '@/health/health.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import * as dotenv from 'dotenv';
import { AuthGuardMiddleware } from '@/common/auth/auth-guard.middleware';
import { PatchModule } from '@/patch/patch.module';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    ServeStaticModule.forRoot({
      // serveRoot: 'downloads', // 이 경로로 정적 파일 서빙
      rootPath: join(__dirname, '..', process.env.PATCH_FILE_PATH),
    }),
    AuthModule,
    DatabaseModule,
    HealthModule,
    PatchModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Logger,
    // {
    //   provide: APP_FILTER,
    //   useClass: HttpExceptionFilter,
    // },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLoggerInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthGuardMiddleware).forRoutes('*');
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
// export class AppModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply((req, res, next) => {
//         const context = { switchToHttp: () => ({ getRequest: () => req }) };
//         // const guard = new ApiKeyGuard();

//         // if (guard.canActivate(context as any)) {
//         next();
//         // } else {
//         //   res.status(401).send('Unauthorized');
//         // }
//       })
//       .forRoutes({ path: '/downloads/*', method: RequestMethod.GET });
//   }
// }
