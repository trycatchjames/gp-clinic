import { relations } from 'drizzle-orm';
import {
  boolean,
  date,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { id, timestamps, version } from './_shared';
import {
  claimStatusEnum,
  feeScheduleKindEnum,
  invoiceStatusEnum,
  payerEnum,
  paymentMethodEnum,
} from './enums';
import { practices, practiceLocations } from './practice';
import { practitioners } from './practitioner';
import { mbsItems } from './reference';

/**
 * A fee schedule per payer. The Bulk Bill and DVA schedules are locked to their
 * external schedules; Private and WorkCover are editable per item.
 */
export const feeSchedules = pgTable(
  'fee_schedules',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    kind: feeScheduleKindEnum('kind').notNull(),
    name: text('name').notNull(),
    isEditable: boolean('is_editable').default(true).notNull(),
    isDefault: boolean('is_default').default(false).notNull(),
    effectiveFrom: date('effective_from').notNull(),
    effectiveTo: date('effective_to'),
    version: version(),
    ...timestamps,
  },
  (t) => [index('fee_schedules_practice_idx').on(t.practiceId)],
);

/** A priced line in a schedule. Either an MBS item or a practice-defined item. */
export const feeScheduleItems = pgTable(
  'fee_schedule_items',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    feeScheduleId: uuid('fee_schedule_id')
      .notNull()
      .references(() => feeSchedules.id, { onDelete: 'cascade' }),
    mbsItemId: uuid('mbs_item_id').references(() => mbsItems.id),
    /** Practice-defined code for non-Medicare items. */
    itemCode: text('item_code').notNull(),
    description: text('description').notNull(),
    feeCents: integer('fee_cents').notNull(),
    /** Cached so the patient gap can be shown without a join at the point of billing. */
    benefitCents: integer('benefit_cents').default(0).notNull(),
    effectiveFrom: date('effective_from').notNull(),
    effectiveTo: date('effective_to'),
    ...timestamps,
  },
  (t) => [
    uniqueIndex('fee_schedule_items_unique').on(
      t.feeScheduleId,
      t.itemCode,
      t.effectiveFrom,
    ),
    index('fee_schedule_items_schedule_idx').on(t.feeScheduleId),
  ],
);

export const invoices = pgTable(
  'invoices',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    locationId: uuid('location_id')
      .notNull()
      .references(() => practiceLocations.id),
    practitionerId: uuid('practitioner_id')
      .notNull()
      .references(() => practitioners.id),
    patientId: uuid('patient_id').notNull(),
    encounterId: uuid('encounter_id'),

    invoiceNumber: integer('invoice_number').notNull(),
    payer: payerEnum('payer').notNull(),
    payerReason: text('payer_reason'),
    payerOverrideReason: text('payer_override_reason'),

    /** The provider number for this practitioner at this location, at time of issue. */
    providerNumber: text('provider_number'),

    status: invoiceStatusEnum('status').default('draft').notNull(),
    serviceDate: date('service_date').notNull(),
    issuedAt: timestamp('issued_at', { withTimezone: true }),

    totalCents: integer('total_cents').default(0).notNull(),
    benefitCents: integer('benefit_cents').default(0).notNull(),
    gapCents: integer('gap_cents').default(0).notNull(),
    paidCents: integer('paid_cents').default(0).notNull(),

    /** Assignment of benefit, captured for bulk-billed services. */
    assignmentOfBenefitCapturedAt: timestamp('assignment_of_benefit_captured_at', {
      withTimezone: true,
    }),
    assignmentSignedBy: text('assignment_signed_by'),

    /** Recorded when a BBPIP practice privately bills an eligible service. */
    bbpipExceptionReason: text('bbpip_exception_reason'),

    creditsInvoiceId: uuid('credits_invoice_id'),
    version: version(),
    ...timestamps,
  },
  (t) => [
    uniqueIndex('invoices_number_unique').on(t.practiceId, t.invoiceNumber),
    index('invoices_patient_idx').on(t.patientId),
    index('invoices_service_date_idx').on(t.practiceId, t.serviceDate),
  ],
);

export const invoiceLines = pgTable(
  'invoice_lines',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    invoiceId: uuid('invoice_id')
      .notNull()
      .references(() => invoices.id, { onDelete: 'cascade' }),
    mbsItemId: uuid('mbs_item_id').references(() => mbsItems.id),
    itemCode: text('item_code').notNull(),
    description: text('description').notNull(),
    quantity: integer('quantity').default(1).notNull(),
    feeCents: integer('fee_cents').notNull(),
    benefitCents: integer('benefit_cents').default(0).notNull(),
    /** Why the system suggested this item, retained for compliance review. */
    suggestionReason: text('suggestion_reason'),
    overrideReason: text('override_reason'),
    ...timestamps,
  },
  (t) => [index('invoice_lines_invoice_idx').on(t.invoiceId)],
);

export const payments = pgTable(
  'payments',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    invoiceId: uuid('invoice_id')
      .notNull()
      .references(() => invoices.id, { onDelete: 'cascade' }),
    method: paymentMethodEnum('method').notNull(),
    amountCents: integer('amount_cents').notNull(),
    receivedAt: timestamp('received_at', { withTimezone: true }).defaultNow().notNull(),
    reference: text('reference'),
    ...timestamps,
  },
  (t) => [index('payments_invoice_idx').on(t.invoiceId)],
);

export const claims = pgTable(
  'claims',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    locationId: uuid('location_id').references(() => practiceLocations.id),
    batchReference: text('batch_reference'),
    payer: payerEnum('payer').notNull(),
    status: claimStatusEnum('status').default('draft').notNull(),
    submittedAt: timestamp('submitted_at', { withTimezone: true }),
    respondedAt: timestamp('responded_at', { withTimezone: true }),
    rejectionCode: text('rejection_code'),
    rejectionReason: text('rejection_reason'),
    expectedCents: integer('expected_cents').default(0).notNull(),
    paidCents: integer('paid_cents').default(0).notNull(),
    version: version(),
    ...timestamps,
  },
  (t) => [index('claims_practice_status_idx').on(t.practiceId, t.status)],
);

export const claimItems = pgTable(
  'claim_items',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    claimId: uuid('claim_id')
      .notNull()
      .references(() => claims.id, { onDelete: 'cascade' }),
    invoiceLineId: uuid('invoice_line_id')
      .notNull()
      .references(() => invoiceLines.id),
    expectedCents: integer('expected_cents').notNull(),
    paidCents: integer('paid_cents').default(0).notNull(),
    ...timestamps,
  },
  (t) => [uniqueIndex('claim_items_line_unique').on(t.invoiceLineId)],
);

export const feeSchedulesRelations = relations(feeSchedules, ({ one, many }) => ({
  practice: one(practices, {
    fields: [feeSchedules.practiceId],
    references: [practices.id],
  }),
  items: many(feeScheduleItems),
}));

export const invoicesRelations = relations(invoices, ({ many }) => ({
  lines: many(invoiceLines),
  payments: many(payments),
}));
