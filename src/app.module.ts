import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { env } from 'node:process';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksModule } from './books/books.module';
import { AuthorsModule } from './authors/authors.module';
import { HealthModule } from './health/health.module';

export type environmentTypes = 'dev' | 'test' | 'prod';

/**
 * Find the correct env file based on the NODE_ENV.
 * @param env
 */
export function getEnvConfigFileName(env: string): string {
  switch (env as environmentTypes) {
    case 'test':
      return '.testing.env';
    case 'dev':
      return '.development.env';
    case 'prod':
      return '.production.env';
    default:
      throw new Error(`Environment NODE_ENV ${env}, is not acceptable!`);
  }
}

@Module({
  imports: [
    // Set up the config module to read the .env file etc
    ConfigModule.forRoot({
      envFilePath: getEnvConfigFileName(env.NODE_ENV),
      expandVariables: true,
      cache: true,
      isGlobal: true,
    }),
    // Set up the database module
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: +config.get<string>('DB_PORT'),
        database: config.get<string>('DB_NAME'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        // Read the entities from other TypeOrmModule.forFeature definitions
        autoLoadEntities: true,
        // Updates the schema
        synchronize: config.get<environmentTypes>('NODE_ENV') === 'dev',
        // Enable to print the queries
        logging: false,
        // Run migrations
        migrationsRun: config.get<environmentTypes>('NODE_ENV') !== 'dev',
        migrationsTableName: 'schema_migrations',
        migrations: ['./dist/src/migrations/**/*{.ts,.js}'],
        retryAttempts: 0,
      }),
    }),
    HealthModule,
    BooksModule,
    AuthorsModule,
  ],
})
export class AppModule {}
