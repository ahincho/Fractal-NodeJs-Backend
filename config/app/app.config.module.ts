import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from 'config/database/database.config';
import typeOrmConfig from 'config/orm/type.orm.config';
import appConfig from './app.config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig, databaseConfig, typeOrmConfig],
      validationSchema: Joi.object({
        APP_NAME: Joi.string().required(),
        APP_ENVIRONMENT: Joi.string().required(),
        APP_PORT: Joi.number().required(),
        DATABASE_VENDOR: Joi.string().required(),
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.number().required(),
        DATABASE_NAME: Joi.string().required(),
        DATABASE_USERNAME: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        TYPE_ORM_POOL_SIZE: Joi.number().required(),
        TYPE_ORM_RETRY_ATTEMPTS: Joi.number().required(),
        TYPE_ORM_RETRY_DELAY: Joi.number().required(),
        TYPE_ORM_SYNCHRONIZE: Joi.boolean().required(),
        TYPE_ORM_LOGGING: Joi.boolean().required(),
      }),
    }),
  ],
})
export class AppConfigModule {}
