import { Inject, Injectable } from '@nestjs/common';
import { DATABASE } from '../db/database.module';
import type { Database } from '../db/client';
import { auditLogEntries } from '../db/schema';
import { uuidv7 } from '../db/uuid';

export interface AuditEntry {
  practiceId?: string | null;
  actorUserId?: string | null;
  patientId?: string | null;
  action: string;
  entityType?: string;
  entityId?: string;
  breakGlassReason?: string;
  ipAddress?: string;
  userAgent?: string;
  context?: Record<string, unknown>;
}

/**
 * Append-only. Nothing in the application deletes or amends an audit entry —
 * that is what makes RACGP C6.3 demonstrable.
 */
@Injectable()
export class AuditService {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  async record(entry: AuditEntry): Promise<void> {
    await this.db.insert(auditLogEntries).values({
      id: uuidv7(),
      practiceId: entry.practiceId ?? null,
      actorUserId: entry.actorUserId ?? null,
      patientId: entry.patientId ?? null,
      action: entry.action,
      entityType: entry.entityType,
      entityId: entry.entityId,
      breakGlassReason: entry.breakGlassReason,
      ipAddress: entry.ipAddress,
      userAgent: entry.userAgent,
      context: entry.context,
    });
  }
}
