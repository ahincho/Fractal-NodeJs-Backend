import { registerAs } from "@nestjs/config";

export default registerAs('database', () => ({
  vendor: process.env.DATABASE_VENDOR,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  name: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
}));
