import {
  Logger,
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { findKeyValueByValue } from '@/common/utils/objects';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly logger = new Logger(ApiKeyGuard.name);
  apiKeys: any;

  constructor(private readonly configService: ConfigService) {
    const envApiKeys = configService.get<string>('API_KEYS');
    this.apiKeys = JSON.parse(envApiKeys);

    this.logger.log(`Api Keys: ${JSON.stringify(this.apiKeys, null, 2)}`);
  }

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const apiKey = request.header('x-api-key');

    // 여기에 실제 API Key 검증 로직을 넣습니다. 예시로 하드코딩된 API Key를 사용합니다.
    // const validApiKey = 'your-secure-api-key';
    // if (apiKey && apiKey === validApiKey) {
    //   return true;
    // } else {
    //   throw new UnauthorizedException('Invalid API key');
    // }

    const find = findKeyValueByValue(this.apiKeys, apiKey);
    if (Object.keys(find).length > 0) {
      return true;
    } else {
      return false;
    }
  }
}
