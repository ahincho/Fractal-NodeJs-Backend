import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}
  get name() {
    return this.configService.get('app.name');
  }
  get environment() {
    return this.configService.get('app.environment');
  }
  get port() {
    return this.configService.get('app.port');
  }
}

export default () => ({
  name: process.env.APP_NAME,
  environment: process.env.APP_ENVIRONMENT,
  port: Number(process.env.APP_PORT),
});
