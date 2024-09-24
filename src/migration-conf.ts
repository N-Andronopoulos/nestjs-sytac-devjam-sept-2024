import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as process from 'node:process';

config({ path: '.production.env' });

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: ['./src/**/*.entity{.ts,.js}'],
  migrations: ['./src/migrations/**/*{.ts,.js}'],
  migrationsTableName: 'schema_migrations',
  logging: true,
});
