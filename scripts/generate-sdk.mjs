#!/usr/bin/env node
/**
 * Generates a typed TypeScript client from openapi/openapi.json.
 *
 * Deliberately dependency-free and deterministic: there is no black box between
 * the NestJS decorators and the client the web app calls. Run `pnpm api:generate`
 * to regenerate the whole chain (contracts -> openapi -> sdk).
 */
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const specPath = join(root, 'openapi', 'openapi.json');
const outDir = join(root, 'packages', 'sdk', 'src', 'generated');

const spec = JSON.parse(readFileSync(specPath, 'utf8'));
const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete'];

// --- type rendering ---------------------------------------------------------

function refName(ref) {
  return ref.split('/').pop();
}

function renderType(schema, indent = 0) {
  if (!schema) return 'unknown';
  if (schema.$ref) return refName(schema.$ref);

  if (schema.allOf) {
    return schema.allOf.map((s) => renderType(s, indent)).join(' & ');
  }
  if (schema.oneOf || schema.anyOf) {
    return (schema.oneOf ?? schema.anyOf).map((s) => renderType(s, indent)).join(' | ');
  }

  let base;
  switch (schema.type) {
    case 'string':
      base = schema.enum
        ? schema.enum.map((v) => JSON.stringify(v)).join(' | ')
        : 'string';
      break;
    case 'integer':
    case 'number':
      base = 'number';
      break;
    case 'boolean':
      base = 'boolean';
      break;
    case 'array':
      base = `${wrapUnion(renderType(schema.items, indent))}[]`;
      break;
    case 'object':
      base = schema.properties
        ? renderObject(schema, indent)
        : schema.additionalProperties
          ? `Record<string, ${renderType(schema.additionalProperties, indent)}>`
          : 'Record<string, unknown>';
      break;
    default:
      base = schema.properties ? renderObject(schema, indent) : 'unknown';
  }

  return schema.nullable ? `${wrapUnion(base)} | null` : base;
}

function wrapUnion(type) {
  return /[|&]/.test(type) && !type.startsWith('(') ? `(${type})` : type;
}

function renderObject(schema, indent) {
  const pad = '  '.repeat(indent + 1);
  const closePad = '  '.repeat(indent);
  const required = new Set(schema.required ?? []);
  const lines = Object.entries(schema.properties ?? {}).map(([name, prop]) => {
    const doc = propDoc(prop, pad);
    const optional = required.has(name) ? '' : '?';
    return `${doc}${pad}${safeKey(name)}${optional}: ${renderType(prop, indent + 1)};`;
  });
  return `{\n${lines.join('\n')}\n${closePad}}`;
}

function propDoc(prop, pad) {
  const parts = [];
  if (prop.description) parts.push(prop.description);
  if (prop.example !== undefined) parts.push(`@example ${JSON.stringify(prop.example)}`);
  if (!parts.length) return '';
  if (parts.length === 1 && parts[0].length < 90) {
    return `${pad}/** ${parts[0]} */\n`;
  }
  return `${pad}/**\n${parts.map((p) => `${pad} * ${p}`).join('\n')}\n${pad} */\n`;
}

function safeKey(name) {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name) ? name : JSON.stringify(name);
}

// --- types.ts ---------------------------------------------------------------

function generateTypes() {
  const schemas = spec.components?.schemas ?? {};
  const out = [
    '/* eslint-disable */',
    '// Generated from openapi/openapi.json by scripts/generate-sdk.mjs — do not edit.',
    '',
  ];

  for (const [name, schema] of Object.entries(schemas).sort(([a], [b]) => a.localeCompare(b))) {
    if (schema.description) {
      out.push('/**', ` * ${schema.description.split('\n').join('\n * ')}`, ' */');
    }
    if (schema.type === 'object' || schema.properties) {
      out.push(`export interface ${name} ${renderObject(schema, 0)}`, '');
    } else {
      out.push(`export type ${name} = ${renderType(schema, 0)};`, '');
    }
  }

  return out.join('\n');
}

// --- client.ts --------------------------------------------------------------

function collectOperations() {
  const operations = [];
  for (const [path, item] of Object.entries(spec.paths ?? {})) {
    for (const method of HTTP_METHODS) {
      const op = item[method];
      if (!op) continue;
      if (!op.operationId) {
        throw new Error(`Missing operationId for ${method.toUpperCase()} ${path}`);
      }

      const params = [...(item.parameters ?? []), ...(op.parameters ?? [])];
      const pathParams = params.filter((p) => p.in === 'path');
      const queryParams = params.filter((p) => p.in === 'query');

      const bodySchema =
        op.requestBody?.content?.['application/json']?.schema ?? null;

      const successCode = Object.keys(op.responses ?? {}).find((c) => c.startsWith('2'));
      const responseSchema =
        successCode && op.responses[successCode]?.content?.['application/json']?.schema
          ? op.responses[successCode].content['application/json'].schema
          : null;

      operations.push({
        operationId: op.operationId,
        method,
        path,
        summary: op.summary,
        description: op.description,
        tags: op.tags ?? [],
        pathParams,
        queryParams,
        bodySchema,
        responseSchema,
        requiresAuth: !!(op.security?.length ?? spec.security?.length) || !!op.security,
      });
    }
  }
  return operations.sort((a, b) => a.operationId.localeCompare(b.operationId));
}

function generateClient(operations) {
  const usedTypes = new Set();
  const collect = (schema) => {
    if (!schema) return;
    if (schema.$ref) usedTypes.add(refName(schema.$ref));
    if (schema.items) collect(schema.items);
    for (const key of ['allOf', 'oneOf', 'anyOf']) {
      (schema[key] ?? []).forEach(collect);
    }
    Object.values(schema.properties ?? {}).forEach(collect);
  };
  operations.forEach((op) => {
    collect(op.bodySchema);
    collect(op.responseSchema);
  });

  const imports = [...usedTypes].sort();

  const methods = operations.map((op) => {
    const args = [];
    for (const param of op.pathParams) {
      args.push(`${camel(param.name)}: ${renderType(param.schema, 2)}`);
    }
    if (op.bodySchema) args.push(`body: ${renderType(op.bodySchema, 2)}`);
    if (op.queryParams.length) {
      const queryFields = op.queryParams
        .map(
          (p) =>
            `${safeKey(p.name)}${p.required ? '' : '?'}: ${renderType(p.schema, 3)}`,
        )
        .join('; ');
      args.push(`query?: { ${queryFields} }`);
    }
    args.push('options?: RequestOptions');

    const returnType = op.responseSchema ? renderType(op.responseSchema, 2) : 'void';
    const pathExpr = op.path.replace(
      /\{([^}]+)\}/g,
      (_, name) => '${encodeURIComponent(String(' + camel(name) + '))}',
    );

    const docLines = [];
    if (op.summary) docLines.push(op.summary);
    if (op.description) {
      docLines.push('', ...op.description.split('\n'));
    }
    docLines.push('', `\`${op.method.toUpperCase()} ${op.path}\``);
    const doc = `  /**\n${docLines.map((l) => `   *${l ? ` ${l}` : ''}`).join('\n')}\n   */`;

    return [
      doc,
      `  async ${op.operationId}(${args.join(', ')}): Promise<${returnType}> {`,
      `    return this.request<${returnType}>({`,
      `      method: '${op.method.toUpperCase()}',`,
      `      path: \`${pathExpr}\`,`,
      op.bodySchema ? '      body,' : null,
      op.queryParams.length ? '      query,' : null,
      '      options,',
      '    });',
      '  }',
    ]
      .filter(Boolean)
      .join('\n');
  });

  const tagGroups = [...new Set(operations.flatMap((op) => op.tags))].sort();

  return `/* eslint-disable */
// Generated from openapi/openapi.json by scripts/generate-sdk.mjs — do not edit.
//
// ${operations.length} operations across ${tagGroups.length} tags:
// ${tagGroups.join(', ')}

import type {
${imports.map((t) => `  ${t},`).join('\n')}
} from './types';

/** RFC 9457 problem details, as returned by every API error. */
export interface ProblemDetailsBody {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  errors?: { field: string; message: string }[];
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly problem: ProblemDetailsBody,
  ) {
    super(problem.detail ?? problem.title ?? \`Request failed with \${status}\`);
    this.name = 'ApiError';
  }

  /** Field-level validation messages, keyed by field name. */
  get fieldErrors(): Record<string, string> {
    return Object.fromEntries(
      (this.problem.errors ?? []).map((e) => [e.field, e.message]),
    );
  }
}

export interface RequestOptions {
  /**
   * Makes the write replay-safe. The server stores the result against this key for
   * 24 hours and replays it rather than re-executing — this is what lets the
   * offline outbox retry without creating duplicates.
   */
  idempotencyKey?: string;
  signal?: AbortSignal;
  headers?: Record<string, string>;
}

export interface ClientConfig {
  baseUrl: string;
  /** Called before each request. Return null when signed out. */
  getAccessToken?: () => string | null | Promise<string | null>;
  /** Called on a 401 so the caller can refresh and retry once. */
  onUnauthorized?: () => Promise<string | null>;
  fetch?: typeof fetch;
}

interface RequestArgs {
  method: string;
  path: string;
  body?: unknown;
  query?: Record<string, unknown>;
  options?: RequestOptions;
}

export class GpApiClient {
  constructor(private readonly config: ClientConfig) {}

  private async request<T>({ method, path, body, query, options }: RequestArgs): Promise<T> {
    const doFetch = this.config.fetch ?? globalThis.fetch;
    // baseUrl may be relative (e.g. "/api" behind a dev proxy), so resolve it
    // against the document origin when there is one.
    const origin =
      typeof globalThis.location === 'undefined' ? undefined : globalThis.location.origin;
    const url = new URL(this.config.baseUrl.replace(/\\/$/, '') + path, origin);

    for (const [key, value] of Object.entries(query ?? {})) {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    }

    const send = async (token: string | null): Promise<Response> => {
      const headers: Record<string, string> = { Accept: 'application/json', ...options?.headers };
      if (body !== undefined) headers['Content-Type'] = 'application/json';
      if (token) headers.Authorization = \`Bearer \${token}\`;
      if (options?.idempotencyKey) headers['Idempotency-Key'] = options.idempotencyKey;

      return doFetch(url.toString(), {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: options?.signal,
      });
    };

    let token = (await this.config.getAccessToken?.()) ?? null;
    let response = await send(token);

    // One retry after a refresh — anything more risks a loop.
    if (response.status === 401 && this.config.onUnauthorized) {
      token = await this.config.onUnauthorized();
      if (token) response = await send(token);
    }

    if (response.status === 204) return undefined as T;

    const text = await response.text();
    const payload = text ? safeParse(text) : undefined;

    if (!response.ok) {
      throw new ApiError(
        response.status,
        (payload as ProblemDetailsBody) ?? {
          type: 'about:blank',
          title: response.statusText,
          status: response.status,
        },
      );
    }

    return payload as T;
  }

${methods.join('\n\n')}
}

function safeParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}
`;
}

function camel(name) {
  return name.replace(/[-_](.)/g, (_, c) => c.toUpperCase());
}

// --- write ------------------------------------------------------------------

const operations = collectOperations();
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'types.ts'), generateTypes());
writeFileSync(join(outDir, 'client.ts'), generateClient(operations));
writeFileSync(
  join(root, 'packages', 'sdk', 'src', 'index.ts'),
  `// Generated barrel — regenerate with \`pnpm sdk\`.
export * from './generated/types';
export * from './generated/client';
`,
);

console.log(`Generated SDK from ${spec.info.title} v${spec.info.version}`);
console.log(`  ${operations.length} operations`);
console.log(`  ${Object.keys(spec.components?.schemas ?? {}).length} types`);
console.log(`  -> packages/sdk/src/generated/`);
