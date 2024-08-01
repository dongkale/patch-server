import { DownloadFileModule } from '@/module/download-file/download-file.module';
import { Module, Logger, MiddlewareConsumer } from '@nestjs/common';
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

dotenv.config();

@Module({
  imports: [
    DownloadFileModule,
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
    DownloadFileModule,
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
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
