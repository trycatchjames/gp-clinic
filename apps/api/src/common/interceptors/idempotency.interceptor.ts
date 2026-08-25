import {
  CallHandler,
  ConflictException,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { createHash } from 'node:crypto';
import { and, eq, gt } from 'drizzle-orm';
import { from, of, switchMap } from 'rxjs';
import { DATABASE } from '../../db/database.module';
import type { Database } from '../../db/client';
import { idempotencyKeys } from '../../db/schema';
import { uuidv7 } from '../../db/uuid';
import type { AuthenticatedUser } from '../decorators';

const REPLAY_WINDOW_HOURS = 24;

/**
 * Makes writes replay-safe, which is what lets the offline outbox retry without
 * creating duplicates. A repeated Idempotency-Key returns the stored response.
 * See docs/00-foundations/05-offline-and-sync.md.
 */
@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const key: string | undefined = request.headers['idempotency-key'];

    if (!key || !['POST', 'PATCH', 'PUT'].includes(request.method)) {
      return next.handle();
    }

    const requestHash = createHash('sha256')
      .update(JSON.stringify(request.body ?? {}))
      .digest('hex');

    const [existing] = await this.db
      .select()
      .from(idempotencyKeys)
      .where(and(eq(idempotencyKeys.key, key), gt(idempotencyKeys.expiresAt, new Date())))
      .limit(1);

    if (existing) {
      // Same key, different payload: the client has a bug, and replaying the old
      // response would hide it.
      if (existing.requestHash !== requestHash) {
        throw new ConflictException(
          'This Idempotency-Key was already used with a different request body',
        );
      }
      return of(existing.responseBody);
    }

    const user = request.user as AuthenticatedUser | undefined;

    return next.handle().pipe(
      // The stored result must land before the response is returned, so a retry
      // that arrives immediately afterwards is replayed rather than re-executed.
      switchMap((body) =>
        from(
          this.store({
            key,
            requestHash,
            body,
            method: request.method,
            path: request.originalUrl,
            status: context.switchToHttp().getResponse().statusCode,
            practiceId: user?.practiceId ?? null,
            userId: user?.userId ?? null,
          }).then(() => body),
        ),
      ),
    );
  }

  private async store(entry: {
    key: string;
    requestHash: string;
    body: unknown;
    method: string;
    path: string;
    status: number;
    practiceId: string | null;
    userId: string | null;
  }): Promise<void> {
    await this.db
      .insert(idempotencyKeys)
      .values({
        id: uuidv7(),
        key: entry.key,
        practiceId: entry.practiceId,
        userId: entry.userId,
        method: entry.method,
        path: entry.path,
        requestHash: entry.requestHash,
        responseStatus: String(entry.status),
        responseBody: entry.body as never,
        expiresAt: new Date(Date.now() + REPLAY_WINDOW_HOURS * 3600_000),
      })
      .onConflictDoNothing();
  }
}
