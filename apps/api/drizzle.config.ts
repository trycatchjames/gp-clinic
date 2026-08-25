import { config as loadEnv } from 'dotenv';
import { resolve } from 'node:path';
import { defineConfig } from 'drizzle-kit';

loadEnv({ path: resolve(__dirname, '../../.env') });

export default defineConfig({
  schema: './src/db/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      'postgres://gp:gp@localhost:5439/gp_prototype',
  },
  verbose: true,
  strict: true,
});
