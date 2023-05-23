import { DATABASE_CONFIG } from './env';

const seedingConfig = {
  name: 'seeding',
  type: <any>DATABASE_CONFIG.DATABASE_TYPE,
  host: DATABASE_CONFIG.DATABASE_HOST,
  port: DATABASE_CONFIG.DATABASE_PORT,
  username: DATABASE_CONFIG.DATABASE_USER,
  password: DATABASE_CONFIG.DATABASE_PASSWORD,
  database: DATABASE_CONFIG.DATABASE_NAME,
  entities: ['src/**/*.entity.{ts,js}'],
  seeds: ['src/database/seeds/*.seed.{ts,js}'],
  factories: ['src/database/factories/*.factory.{ts,js}'],
};

export default seedingConfig;
