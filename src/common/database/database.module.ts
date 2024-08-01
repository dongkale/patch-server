import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { addTransactionalDataSource } from 'typeorm-transactional';
// import TypeOrmCustomLogger from './query.logger';
// import { TypeOrmCustomLogger } from './query.logger';
// import { TypeOrmCustomLoggerUtil } from './query.logger.util';
import TypeOrmCustomLogger from './query.logger';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService) {
        return {
          type: 'mysql',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          namingStrategy: new SnakeNamingStrategy(),
          autoLoadEntities: true,
          synchronize: false, // synchronize: true는 운영과 개발에도 사용 금지, 테이블을 많이 수정함
          // configService.get<string>('NODE_ENV') == 'development'
          //   ? true
          //   : false, // synchronize: true는 운영에서는 사용하지 마세요
          // logging:
          //   configService.get<string>('NODE_ENV') == 'development'
          //     ? true
          //     : false, // logging: true는 운영에서는 사용하지 마세요. 쿼리가 많아지면 성능에 영향을 줄 수 있습니다.
          // options: boolean | "all" | LogLevel[](LogLevel = "query" | "schema" | "error" | "warn" | "info" | "log" | "migration")
          // logger: new TypeOrmCustomLogger(
          //   configService.get<string>('NODE_ENV') == 'development'
          //     ? 'all'
          //     : 'error',
          // ),
          poolSize: 10,
          poolErrorHandler: async (err) => {
            const reconnection = setInterval(async () => {
              console.log('Retrying connection... ' + err.message);
              const connection = new DataSource({
                type: 'mysql',
                host: configService.get<string>('DB_HOST'),
                port: configService.get<number>('DB_PORT'),
                username: configService.get<string>('DB_USERNAME'),
                password: configService.get<string>('DB_PASSWORD'),
                database: configService.get<string>('DB_NAME'),
              });
              const db = await connection.initialize();
              if (db.isInitialized) clearInterval(reconnection);
            }, 1000);
          },
        };
      },
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        return addTransactionalDataSource(new DataSource(options));
      },
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class DatabaseModule {}
