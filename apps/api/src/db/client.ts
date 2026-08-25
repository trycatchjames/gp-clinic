import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '../config/env';
import * as schema from './schema';

/**
 * postgres-js connects lazily, so creating this at module load does not open a
 * socket. That matters: the OpenAPI generation script boots the Nest application
 * without a database.
 */
export const sql = postgres(env.databaseUrl, {
  max: env.isProduction ? 20 : 5,
  onnotice: () => {},
});

export const db = drizzle(sql, { schema });

export type Database = typeof db;
export { schema };
