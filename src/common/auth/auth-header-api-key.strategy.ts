import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import Strategy from 'passport-headerapikey';

import { findKeyValueByValue } from '@/common/utils/objects';

@Injectable()
export class HeaderApiKeyStrategy extends PassportStrategy(
  Strategy,
  'api-key',
) {
  private readonly logger = new Logger(HeaderApiKeyStrategy.name);
  apiKeys: any;

  constructor(private readonly configService: ConfigService) {
    super({ header: 'X-API-KEY', prefix: '' }, true, async (apiKey, done) => {
      return this.validate(apiKey, done);
    });

    const envApiKeys = configService.get<string>('API_KEYS');
    this.apiKeys = JSON.parse(envApiKeys);

    this.logger.log(`Api Keys: ${JSON.stringify(this.apiKeys, null, 2)}`);
  }

  public validate = (apiKey: string, done: (error: Error, data) => object) => {
    const find = findKeyValueByValue(this.apiKeys, apiKey);
    if (Object.keys(find).length > 0) {
      done(null, true);
      this.logger.log(`Api Key: ${apiKey}(${find.key}) `);
    }

    // this.logger.error(`${apiKey} Invalid API Key`);
    done(new UnauthorizedException(), null);

    // if (this.configService.get<string>('API_KEY') === apiKey) {
    //   done(null, true);
    // }
    // done(new UnauthorizedException(), null);
  };
}
