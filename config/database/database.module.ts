import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseConfigService } from "./database.config.service";
import databaseConfig from "./database.config";

@Module({
  imports: [
    ConfigModule.forFeature(databaseConfig)
  ],
  providers: [DatabaseConfigService],
  exports: [DatabaseConfigService],
})
export class DatabaseConfigModule {}
