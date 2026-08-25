import { sql } from 'drizzle-orm';
import { integer, timestamp, uuid } from 'drizzle-orm/pg-core';

/**
 * Primary key. UUIDs are generated client-side as UUID v7 so an offline device can
 * mint an identity that will not collide on sync. gen_random_uuid() is the
 * server-side fallback when the client does not supply one.
 */
export const id = () =>
  uuid('id').primaryKey().default(sql`gen_random_uuid()`);

/**
 * Every table carries these. Timestamps are timestamptz in UTC; display is in the
 * location's timezone.
 */
export const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  createdBy: uuid('created_by'),
  updatedBy: uuid('updated_by'),
};

/**
 * Clinical and financial records are soft-deleted only. Australian retention runs to
 * seven years from the last entry for adults, and until 25 for children.
 */
export const softDelete = {
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  deletedReason: timestamp('deleted_reason', { withTimezone: true }),
};

/** Optimistic concurrency, and the basis of offline conflict detection. */
export const version = () => integer('version').default(1).notNull();
