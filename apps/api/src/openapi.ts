import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { AppModule } from './app.module';
import { buildOpenApiDocument } from './swagger';
import { sql } from './db/client';

/**
 * Writes openapi/openapi.json without listening on a port. postgres-js connects
 * lazily, so no database is required to generate the document.
 */
async function main() {
  const app = await NestFactory.create(AppModule, { logger: false });
  app.setGlobalPrefix(process.env.API_GLOBAL_PREFIX ?? 'api');
  await app.init();

  const document = buildOpenApiDocument(app);
  const outPath = resolve(__dirname, '../../../openapi/openapi.json');
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, `${JSON.stringify(document, null, 2)}\n`);

  const operations = Object.values(document.paths ?? {}).reduce(
    (count, path) =>
      count +
      Object.keys(path as Record<string, unknown>).filter((k) =>
        ['get', 'post', 'put', 'patch', 'delete'].includes(k),
      ).length,
    0,
  );

  console.log(`Wrote ${outPath}`);
  console.log(
    `  ${Object.keys(document.paths ?? {}).length} paths, ${operations} operations, ${Object.keys(document.components?.schemas ?? {}).length} schemas`,
  );

  await app.close();
  await sql.end({ timeout: 1 }).catch(() => {});
  process.exit(0);
}

void main();
