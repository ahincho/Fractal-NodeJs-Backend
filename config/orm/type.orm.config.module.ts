import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseConfigModule } from "config/database/database.module";
import { TypeOrmConfigService } from "./type.orm.config.service";
import typeOrmConfig from "./type.orm.config";

@Module({
  imports: [
    DatabaseConfigModule,
    ConfigModule.forFeature(typeOrmConfig)
  ],
  providers: [
    TypeOrmConfigService,
  ],
  exports: [TypeOrmConfigService],
})
export class TypeOrmConfigModule {}
