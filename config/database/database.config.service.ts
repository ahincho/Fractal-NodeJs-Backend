import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class DatabaseConfigService {
  constructor(private readonly configService: ConfigService) {}
  get vendor() {
    return this.configService.get('database.vendor');
  }
  get host() {
    return this.configService.get('database.host');
  }
  get port() {
    return this.configService.get('database.port');
  }
  get name() {
    return this.configService.get('database.name');
  }
  get username() {
    return this.configService.get('database.username');
  }
  get password() {
    return this.configService.get('database.password');
  }
}

export default () => ({
  vendor: process.env.DATABASE_VENDOR,
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  name: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
});
