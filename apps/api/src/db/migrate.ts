import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { resolve } from 'node:path';
import { db, sql } from './client';

async function main() {
  console.log('Running migrations...');
  await migrate(db, { migrationsFolder: resolve(__dirname, '../../drizzle') });
  console.log('Migrations complete.');
  await sql.end();
}

main().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
