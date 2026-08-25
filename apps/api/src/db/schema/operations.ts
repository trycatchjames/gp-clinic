import {
  boolean,
  date,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { id, timestamps } from './_shared';
import { taskPriorityEnum, taskStatusEnum } from './enums';
import { practices } from './practice';

/**
 * Append-only audit log. Every clinical record view, every mutation, every
 * export, every login. No application function deletes or amends an entry.
 * RACGP C6.3 and C6.4.
 */
export const auditLogEntries = pgTable(
  'audit_log_entries',
  {
    id: id(),
    practiceId: uuid('practice_id'),
    actorUserId: uuid('actor_user_id'),
    patientId: uuid('patient_id'),
    action: text('action').notNull(),
    entityType: text('entity_type'),
    entityId: uuid('entity_id'),
    /** Stated reason for break-glass access outside normal scope. */
    breakGlassReason: text('break_glass_reason'),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    context: jsonb('context').$type<Record<string, unknown>>(),
    occurredAt: timestamp('occurred_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index('audit_practice_idx').on(t.practiceId, t.occurredAt),
    index('audit_patient_idx').on(t.patientId, t.occurredAt),
    index('audit_actor_idx').on(t.actorUserId, t.occurredAt),
  ],
);

export const tasks = pgTable(
  'tasks',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    category: text('category'),
    priority: taskPriorityEnum('priority').default('normal').notNull(),
    status: taskStatusEnum('status').default('open').notNull(),
    assignedToUserId: uuid('assigned_to_user_id'),
    assignedToPractitionerId: uuid('assigned_to_practitioner_id'),
    patientId: uuid('patient_id'),
    relatedEntityType: text('related_entity_type'),
    relatedEntityId: uuid('related_entity_id'),
    dueOn: date('due_on'),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    completedBy: uuid('completed_by'),
    ...timestamps,
  },
  (t) => [index('tasks_assignee_idx').on(t.practiceId, t.assignedToUserId, t.status)],
);

/** Clinical incidents and near misses. System factors, not individual blame. */
export const incidents = pgTable(
  'incidents',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    category: text('category').notNull(),
    summary: text('summary').notNull(),
    occurredAt: timestamp('occurred_at', { withTimezone: true }).notNull(),
    reportedByUserId: uuid('reported_by_user_id'),
    isAnonymous: boolean('is_anonymous').default(false).notNull(),
    patientAffected: boolean('patient_affected').default(false).notNull(),
    patientId: uuid('patient_id'),
    immediateActions: text('immediate_actions'),
    contributingFactors: text('contributing_factors'),
    severity: text('severity'),
    openDisclosureRecorded: boolean('open_disclosure_recorded').default(false).notNull(),
    closedAt: timestamp('closed_at', { withTimezone: true }),
    closureSummary: text('closure_summary'),
    ...timestamps,
  },
  (t) => [index('incidents_practice_idx').on(t.practiceId, t.category)],
);

/** RACGP Standards criteria and the evidence attached to each. */
export const accreditationCriteria = pgTable(
  'accreditation_criteria',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    criterionCode: text('criterion_code').notNull(),
    criterionTitle: text('criterion_title').notNull(),
    module: text('module').notNull(),
    status: text('status').default('not_met').notNull(),
    responsibleUserId: uuid('responsible_user_id'),
    lastReviewedOn: date('last_reviewed_on'),
    nextReviewOn: date('next_review_on'),
    notes: text('notes'),
    ...timestamps,
  },
  (t) => [index('accreditation_criteria_practice_idx').on(t.practiceId, t.criterionCode)],
);

/** Twice-daily vaccine refrigerator readings. RACGP GP6.1. */
export const coldChainReadings = pgTable(
  'cold_chain_readings',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    locationId: uuid('location_id').notNull(),
    refrigeratorName: text('refrigerator_name').notNull(),
    minTemp: text('min_temp').notNull(),
    maxTemp: text('max_temp').notNull(),
    currentTemp: text('current_temp').notNull(),
    recordedAt: timestamp('recorded_at', { withTimezone: true }).defaultNow().notNull(),
    recordedByUserId: uuid('recorded_by_user_id'),
    isBreach: boolean('is_breach').default(false).notNull(),
    ...timestamps,
  },
  (t) => [index('cold_chain_location_idx').on(t.locationId, t.recordedAt)],
);

/** Sterilisation traceability: patient → procedure → pack → load → cycle. GP4.1. */
export const sterilisationLoads = pgTable(
  'sterilisation_loads',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    locationId: uuid('location_id').notNull(),
    autoclaveName: text('autoclave_name').notNull(),
    loadNumber: text('load_number').notNull(),
    loadedAt: timestamp('loaded_at', { withTimezone: true }).notNull(),
    contents: text('contents').notNull(),
    cycleParameters: text('cycle_parameters'),
    chemicalIndicatorResult: text('chemical_indicator_result'),
    biologicalIndicatorResult: text('biological_indicator_result'),
    cyclePassed: boolean('cycle_passed'),
    quarantinedAt: timestamp('quarantined_at', { withTimezone: true }),
    ...timestamps,
  },
  (t) => [index('sterilisation_loads_practice_idx').on(t.practiceId, t.loadNumber)],
);

/** Equipment register with service and calibration due dates. GP5.2, GP5.3. */
export const equipment = pgTable(
  'equipment',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    locationId: uuid('location_id'),
    /** Doctor's bags belong to a practitioner, not a room. */
    practitionerId: uuid('practitioner_id'),
    name: text('name').notNull(),
    category: text('category').notNull(),
    serialNumber: text('serial_number'),
    purchasedOn: date('purchased_on'),
    serviceIntervalMonths: date('service_interval_months'),
    lastServicedOn: date('last_serviced_on'),
    nextServiceDueOn: date('next_service_due_on'),
    expiresOn: date('expires_on'),
    isSafetyCritical: boolean('is_safety_critical').default(false).notNull(),
    ...timestamps,
  },
  (t) => [index('equipment_practice_idx').on(t.practiceId, t.category)],
);

/**
 * Replay protection for the offline outbox. Each queued mutation carries an
 * Idempotency-Key; the stored result is replayed rather than re-executed.
 */
export const idempotencyKeys = pgTable(
  'idempotency_keys',
  {
    id: id(),
    key: text('key').notNull().unique(),
    practiceId: uuid('practice_id'),
    userId: uuid('user_id'),
    method: text('method').notNull(),
    path: text('path').notNull(),
    requestHash: text('request_hash').notNull(),
    responseStatus: text('response_status'),
    responseBody: jsonb('response_body'),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    ...timestamps,
  },
  (t) => [index('idempotency_keys_expiry_idx').on(t.expiresAt)],
);
