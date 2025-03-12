import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { DatabaseConfigService } from "config/database/database.config.service";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(
    private readonly configService: ConfigService,
    private readonly databaseConfigService: DatabaseConfigService,
  ) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.databaseConfigService.vendor,
      host: this.databaseConfigService.host,
      port: this.databaseConfigService.port,
      username: this.databaseConfigService.username,
      password: this.databaseConfigService.password,
      database: this.databaseConfigService.name,
      poolSize: this.configService.get('typeOrm.poolSize'),
      retryAttempts: this.configService.get('typeOrm.retryAttempts'),
      retryDelay: this.configService.get('typeOrm.retryDelay'),
      autoLoadEntities: true,
      synchronize: this.configService.get('typeOrm.synchronize'),
      logging: this.configService.get('typeOrm.logging'),
    };
  }
}

export default () => ({
  poolSize: Number(process.env.TYPE_ORM_POOL_SIZE),
  retryAttempts: Number(process.env.TYPE_ORM_RETRY_ATTEMPTS),
  retryDelay: Number(process.env.TYPE_ORM_RETRY_DELAY),
  synchronize: process.env.TYPE_ORM_SYNCHRONIZE === 'true',
  logging: process.env.TYPE_ORM_LOGGING === 'true',
});
