import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { getFindValuefromMap } from '@/common/utils/objects';

@Injectable()
export class AuthGuardMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthGuardMiddleware.name);

  // private apiKeys: any;
  private readonly apiKeysMap: Map<string, string>;

  constructor(private readonly configService: ConfigService) {
    const envApiKeys = configService.get<string>('API_KEYS');

    const apiKeysObj = JSON.parse(envApiKeys);
    this.logger.log(`Api Keys: ${JSON.stringify(apiKeysObj, null, 2)}`);

    this.apiKeysMap = new Map(Object.entries(apiKeysObj));

    // this.logger.log(
    //   `Api Keys: ${JSON.stringify(Array.from(this.apiKeysMap.entries()), null, 2)}`,
    // );

    // this.apiKeyFGuard = new ApiKeyGuard(this.configService);
  }

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    const context = { switchToHttp: () => ({ getRequest: () => req }) };

    const request: Request = context.switchToHttp().getRequest();
    const apiKey = request.header('x-api-key');

    if (this.isCheckApiKey(apiKey)) {
      next();
    } else {
      this.logger.error(
        `Invalid Api Key: ${apiKey}, ip: ${ip}, method: ${method}, originalUrl: ${originalUrl}`,
      );
      res.status(401).send('Unauthorized');
    }

    // const guard = new ApiKeyGuard(this.configService);

    // if (this.apiKeyFGuard.canActivate(context as any)) {
    //   next();
    // } else {
    //   res.status(401).send('Unauthorized');
    // }

    // res.status(401).send('Unauthorized');
    // next();
  }

  isCheckApiKey(apiKey: string): boolean {
    // const find = findKeyValueByValue(this.apiKeys, apiKey);
    const find = getFindValuefromMap(this.apiKeysMap, apiKey);

    return Object.keys(find).length > 0 ? true : false;
  }

  // getFindApiKey(map, searchValue) {
  //   let result = {};

  //   for (const [key, value] of map.entries()) {
  //     if (value === searchValue) {
  //       result = { key: key, value: value };
  //       break;
  //     }
  //   }

  //   return result;
  // }
}
