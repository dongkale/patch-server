import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { winstonLogger } from './common/logger/winston.util';
import { ConfigService } from '@nestjs/config';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import 'winston-daily-rotate-file';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { CustomExceptionFilter } from './common/filters/custom-exception.filter';
//import { findKeyValueByValue } from './common/utils/objects';

async function bootstrap() {
  initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3050);
  const appName = configService.get<string>('APP_NAME', 'EMPTY');
  const nodeEnv = configService.get<string>('NODE_ENV', 'EMPTY');
  const isProduction = configService.get('NODE_ENV') === 'production';

  // const apiKeys = configService.get<string>('API_KEYS');
  // const parseApiKeys = JSON.parse(apiKeys);

  // for (const key in parseApiKeys) {
  //   console.log(`${key}: ${parseApiKeys[key]}`);
  // }

  // const s = '1ab2c3d4e5f61ab2c3d4e5f66';
  // const __v = findKeyValueByValue(parseApiKeys, s);
  // console.log(__v.key, __v.value);

  // value 검색
  // const s = '1ab2c3d4e5f61ab2c3d4e5f6';
  // const f = parseApiKeys.find((key) => {
  //   console.log(key);

  //   return s == parseApiKeys[key];
  //   // console.log(parseApiKeys[key]);
  // });

  // Cross-Origin Resource Sharing
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    optionsSuccessStatus: 200,
  });

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalPipes(
    new ValidationPipe({
      /**
       * whitelist: DTO에 없은 속성은 무조건 거른다.
       * forbidNonWhitelisted: 전달하는 요청 값 중에 정의 되지 않은 값이 있으면 Error를 발생합니다.
       * transform: 네트워크를 통해 들어오는 데이터는 일반 JavaScript 객체입니다.
       *            객체를 자동으로 DTO로 변환을 원하면 transform 값을 true로 설정한다.
       * disableErrorMessages: Error가 발생 했을 때 Error Message를 표시 여부 설정(true: 표시하지 않음, false: 표시함)
       *                       배포 환경에서는 true로 설정하는 걸 추천합니다.
       */
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      validationError: { value: true, target: true },
      disableErrorMessages: isProduction,
      // exceptionFactory: (validationErrors: ValidationError[] = []) => {
      //   return new BadRequestException(
      //     validationErrors.map((e) => new CustomValidationError(e)),
      //   );
      // },
    }),
  );

  app.useGlobalFilters(new CustomExceptionFilter());

  app.enableShutdownHooks();
  app.useLogger(winstonLogger(appName));

  let isDisableKeepAlice = false;

  app.use((req, res, next) => {
    if (isDisableKeepAlice) {
      res.set('Connection', 'close');
    }
    next();
  });

  process.on('SIGINT', async () => {
    isDisableKeepAlice = false;
    app.close().then(() => {
      process.exit(0);
    });
  });

  await app.listen(port, function () {
    if (process.send) {
      process.send('ready');
    }

    console.log(
      `[${appName}][${nodeEnv}] application is listening on port ${port}...`,
    );
  });

  // console.log(
  //   `[${appName}][${nodeEnv}] Application is running on: ${await app.getUrl()}`,
  // );
}
bootstrap();
