import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import Strategy from 'passport-headerapikey';
import { getFindValuefromMap } from '@/common/utils/objects';

@Injectable()
export class HeaderApiKeyStrategy extends PassportStrategy(
  Strategy,
  'api-key',
) {
  private readonly logger = new Logger(HeaderApiKeyStrategy.name);
  private readonly apiKeysMap: Map<string, string>;

  constructor(private readonly configService: ConfigService) {
    super({ header: 'X-API-KEY', prefix: '' }, true, async (apiKey, done) => {
      return this.validate(apiKey, done);
    });

    const envApiKeys = configService.get<string>('API_KEYS');

    const apiKeysObj = JSON.parse(envApiKeys);
    this.logger.log(`Api Keys: ${JSON.stringify(apiKeysObj, null, 2)}`);

    this.apiKeysMap = new Map(Object.entries(apiKeysObj));
  }

  validate(apiKey: string, done: (error: Error, data) => object) {
    // const find = getFindValuefromMap(this.apiKeysMap, apiKey);
    // if (Object.keys(find).length > 0) {
    if (this.isCheckApiKey(apiKey)) {
      done(null, true);
      // this.logger.log(`Api Key: ${apiKey}(${find.key}) `);
    }

    // this.logger.error(`${apiKey} Invalid API Key`);
    done(new UnauthorizedException(), null);

    // if (this.configService.get<string>('API_KEY') === apiKey) {
    //   done(null, true);
    // }
    // done(new UnauthorizedException(), null);
  }

  isCheckApiKey(apiKey: string): boolean {
    // const find = findKeyValueByValue(this.apiKeys, apiKey);
    const find = getFindValuefromMap(this.apiKeysMap, apiKey);

    return Object.keys(find).length > 0 ? true : false;
  }
}
