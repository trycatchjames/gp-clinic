import { config as loadEnv } from 'dotenv';
import { resolve } from 'node:path';

/** The repo keeps a single .env at the root; every app reads from it. */
loadEnv({ path: resolve(__dirname, '../../../../.env') });
loadEnv();

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  isProduction: process.env.NODE_ENV === 'production',
  databaseUrl: required('DATABASE_URL', 'postgres://gp:gp@localhost:5439/gp_prototype'),
  apiPort: Number(process.env.API_PORT ?? 3001),
  globalPrefix: process.env.API_GLOBAL_PREFIX ?? 'api',
  jwt: {
    accessSecret: required('JWT_ACCESS_SECRET', 'dev-access-secret-change-me'),
    refreshSecret: required('JWT_REFRESH_SECRET', 'dev-refresh-secret-change-me'),
    accessTtl: process.env.JWT_ACCESS_TTL ?? '15m',
    refreshTtl: process.env.JWT_REFRESH_TTL ?? '30d',
  },
  webOrigin: process.env.WEB_ORIGIN ?? 'http://localhost:5173',
};
