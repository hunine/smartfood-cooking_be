import { DataSource } from 'typeorm';
import { DATABASE_CONFIG, NODE_ENV } from '@config/env';

export enum DatabaseProvider {
  SOURCE = 'DATA_SOURCE',
}

const synchronize = true;
const dataSource = new DataSource({
  type: <any>DATABASE_CONFIG.DATABASE_TYPE || 'postgres',
  host: DATABASE_CONFIG.DATABASE_HOST,
  port: DATABASE_CONFIG.DATABASE_PORT,
  username: DATABASE_CONFIG.DATABASE_USER,
  password: DATABASE_CONFIG.DATABASE_PASSWORD,
  database: DATABASE_CONFIG.DATABASE_NAME,
  entities: [DATABASE_CONFIG.ENTITIES],
  synchronize: NODE_ENV === 'development' ? synchronize : false,
});

export const databaseProviders = [
  {
    provide: DatabaseProvider.SOURCE,
    useFactory: async () => dataSource.initialize(),
  },
];

export default dataSource;
