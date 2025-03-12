import { registerAs } from "@nestjs/config";

export default registerAs('typeOrm', () => ({
  poolSize: process.env.TYPE_ORM_POOL_SIZE,
  retryAttempts: process.env.TYPE_ORM_RETRY_ATTEMPTS,
  retryDelay: process.env.TYPE_ORM_RETRY_DELAY,
  synchronize: process.env.TYPE_ORM_SYNCHRONIZE,
  logging: process.env.TYPE_ORM_LOGGING,
}));
