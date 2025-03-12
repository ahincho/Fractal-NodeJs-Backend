import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from 'config/app/app.config.module';
import { DatabaseConfigModule } from 'config/database/database.module';
import { TypeOrmConfigModule } from 'config/orm/type.orm.config.module';
import { TypeOrmConfigService } from 'config/orm/type.orm.config.service';

@Module({
  imports: [
    AppConfigModule,
    DatabaseConfigModule,
    TypeOrmModule.forRootAsync({
      useExisting: TypeOrmConfigService,
      imports: [TypeOrmConfigModule],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
