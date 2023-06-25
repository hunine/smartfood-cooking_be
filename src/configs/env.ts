import { config } from 'dotenv';

config();

const env = process.env;

export const NODE_ENV = env.NODE_ENV || 'development';
export const PORT = parseInt(env.PORT, 10) || 3000;
export const BASE_URL = env.BASE_URL || 'http://localhost:3000';
export const BCRYPT_SALT_ROUND =
  parseInt(env.BCRYPT_SALT_ROUND as string) || 10;
export const JWT_SECRET = env.JWT_SECRET || '';
export const JWT_EXPIRES_IN = env.JWT_EXPIRES_IN || '1d';
export const DATABASE_CONFIG = {
  DATABASE_TYPE: env.DATABASE_TYPE || 'postgres',
  DATABASE_HOST: env.DATABASE_HOST || 'localhost',
  DATABASE_PORT: parseInt(env.DATABASE_PORT, 10) || 5432,
  DATABASE_NAME: env.DATABASE_NAME || 'smartfood_cooking',
  DATABASE_USER: env.DATABASE_USER || 'postgres',
  DATABASE_PASSWORD: env.DATABASE_PASSWORD || 'postgres',
  ENTITIES: env.ENTITIES || 'dist/**/*.entity{.ts,.js}',
  SEEDS: env.SEEDS || 'dist/**/*.seed{.ts,.js}',
  FACTORIES: env.FACTORIES || `${__dirname}/src/**/**/*{.ts,.js}`,
  MIGRATIONS: env.MIGRATIONS || 'dist/migrations/*{.ts,.js}',
  MIGRATIONS_TABLE_NAME: env.MIGRATIONS_TABLE_NAME || 'typeorm_migrations',
};

export const CLOUDINARY = {
  CLOUD_NAME: env.CLOUDINARY_CLOUD_NAME || '',
  API_KEY: env.CLOUDINARY_API_KEY || '',
  API_SECRET: env.CLOUDINARY_API_SECRET || '',
};

export const RECOMMENDER_SERVICE = {
  URL: env.RECOMMENDER_SERVICE_URL || '',
  API_KEY: env.RECOMMENDER_SERVICE_API_KEY || '',
};
