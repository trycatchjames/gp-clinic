import { relations } from 'drizzle-orm';
import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  time,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { id, timestamps, version } from './_shared';
import {
  appointmentStatusEnum,
  dayOfWeekEnum,
  triageActionEnum,
} from './enums';
import { practices, practiceLocations } from './practice';
import { practitioners } from './practitioner';

/**
 * What can be booked, for how long, and what it usually bills as.
 * The default MBS item is a suggestion only — nothing bills automatically.
 */
export const appointmentTypes = pgTable(
  'appointment_types',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    shortCode: text('short_code').notNull(),
    durationMinutes: integer('duration_minutes').notNull(),
    colour: text('colour').notNull(),
    description: text('description'),
    /** Practitioner kinds that may be booked into this type. */
    allowedPractitionerKinds: jsonb('allowed_practitioner_kinds')
      .$type<string[]>()
      .default([])
      .notNull(),
    onlineBookable: boolean('online_bookable').default(false).notNull(),
    newPatientsAllowed: boolean('new_patients_allowed').default(true).notNull(),
    doubleBookingAllowed: boolean('double_booking_allowed').default(false).notNull(),
    requiresTriagePrompt: boolean('requires_triage_prompt').default(false).notNull(),
    minNoticeMinutes: integer('min_notice_minutes'),
    maxAdvanceDays: integer('max_advance_days'),
    defaultMbsItemNumber: text('default_mbs_item_number'),
    sortOrder: integer('sort_order').default(0).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    version: version(),
    ...timestamps,
  },
  (t) => [index('appointment_types_practice_idx').on(t.practiceId)],
);

/** A practitioner's recurring availability window at a location. */
export const sessionTemplates = pgTable(
  'session_templates',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    practitionerId: uuid('practitioner_id')
      .notNull()
      .references(() => practitioners.id, { onDelete: 'cascade' }),
    locationId: uuid('location_id')
      .notNull()
      .references(() => practiceLocations.id, { onDelete: 'cascade' }),
    dayOfWeek: dayOfWeekEnum('day_of_week').notNull(),
    startsAt: time('starts_at').notNull(),
    endsAt: time('ends_at').notNull(),
    slotMinutes: integer('slot_minutes').default(15).notNull(),
    onlineBookable: boolean('online_bookable').default(true).notNull(),
    allowedAppointmentTypeIds: jsonb('allowed_appointment_type_ids')
      .$type<string[]>()
      .default([])
      .notNull(),
    outsideOpeningHoursReason: text('outside_opening_hours_reason'),
    effectiveFrom: date('effective_from'),
    effectiveTo: date('effective_to'),
    isActive: boolean('is_active').default(true).notNull(),
    ...timestamps,
  },
  (t) => [
    index('session_templates_practitioner_idx').on(t.practitionerId),
    index('session_templates_location_day_idx').on(t.locationId, t.dayOfWeek),
  ],
);

/** Leave, conferences, public holidays, or an extra Saturday morning. */
export const sessionOverrides = pgTable(
  'session_overrides',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    practitionerId: uuid('practitioner_id')
      .notNull()
      .references(() => practitioners.id, { onDelete: 'cascade' }),
    locationId: uuid('location_id').references(() => practiceLocations.id),
    startsOn: date('starts_on').notNull(),
    endsOn: date('ends_on').notNull(),
    /** true adds availability, false removes it. */
    addsAvailability: boolean('adds_availability').default(false).notNull(),
    startsAt: time('starts_at'),
    endsAt: time('ends_at'),
    reason: text('reason').notNull(),
    ...timestamps,
  },
  (t) => [index('session_overrides_practitioner_idx').on(t.practitionerId)],
);

export const appointments = pgTable(
  'appointments',
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
    appointmentTypeId: uuid('appointment_type_id')
      .notNull()
      .references(() => appointmentTypes.id),

    startsAt: timestamp('starts_at', { withTimezone: true }).notNull(),
    durationMinutes: integer('duration_minutes').notNull(),
    reasonForVisit: text('reason_for_visit').notNull(),

    status: appointmentStatusEnum('status').default('booked').notNull(),
    bookedOnline: boolean('booked_online').default(false).notNull(),
    isDoubleBooked: boolean('is_double_booked').default(false).notNull(),
    overbookingReason: text('overbooking_reason'),
    outsideAvailabilityReason: text('outside_availability_reason'),
    nonBillable: boolean('non_billable').default(false).notNull(),

    /** Preserved when an appointment is rescheduled rather than cancelled and rebooked. */
    originalStartsAt: timestamp('original_starts_at', { withTimezone: true }),
    cancelledAt: timestamp('cancelled_at', { withTimezone: true }),
    cancelledBy: text('cancelled_by'),
    cancellationReason: text('cancellation_reason'),
    isLateCancellation: boolean('is_late_cancellation').default(false).notNull(),

    /** A cancellation never closes the underlying recall. */
    linkedRecallId: uuid('linked_recall_id'),

    version: version(),
    ...timestamps,
  },
  (t) => [
    index('appointments_book_idx').on(t.locationId, t.startsAt),
    index('appointments_practitioner_idx').on(t.practitionerId, t.startsAt),
    index('appointments_patient_idx').on(t.patientId),
  ],
);

/** Immutable status history. Corrections are new entries, never edits. */
export const appointmentStatusHistory = pgTable(
  'appointment_status_history',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    appointmentId: uuid('appointment_id')
      .notNull()
      .references(() => appointments.id, { onDelete: 'cascade' }),
    fromStatus: appointmentStatusEnum('from_status'),
    toStatus: appointmentStatusEnum('to_status').notNull(),
    occurredAt: timestamp('occurred_at', { withTimezone: true }).defaultNow().notNull(),
    actorUserId: uuid('actor_user_id'),
    correctionReason: text('correction_reason'),
    ...timestamps,
  },
  (t) => [index('appointment_status_history_appointment_idx').on(t.appointmentId)],
);

/** Red-flag scripts shown to reception at booking. Practice-editable, safe defaults. */
export const triagePrompts = pgTable(
  'triage_prompts',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    promptKey: text('prompt_key').notNull(),
    label: text('label').notNull(),
    matches: jsonb('matches').$type<string[]>().default([]).notNull(),
    question: text('question').notNull(),
    action: triageActionEnum('action').notNull(),
    blocksOnlineBooking: boolean('blocks_online_booking').default(true).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    ...timestamps,
  },
  (t) => [index('triage_prompts_practice_idx').on(t.practiceId)],
);

/** Every fired prompt is recorded — a safety net and QI evidence. */
export const triageEvents = pgTable(
  'triage_events',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    triagePromptId: uuid('triage_prompt_id').references(() => triagePrompts.id),
    patientId: uuid('patient_id'),
    appointmentId: uuid('appointment_id').references(() => appointments.id),
    reasonText: text('reason_text').notNull(),
    promptShown: text('prompt_shown').notNull(),
    selectedAction: triageActionEnum('selected_action').notNull(),
    outcome: text('outcome'),
    escalatedToUserId: uuid('escalated_to_user_id'),
    escalatedAt: timestamp('escalated_at', { withTimezone: true }),
    acknowledgedAt: timestamp('acknowledged_at', { withTimezone: true }),
    actorUserId: uuid('actor_user_id'),
    ...timestamps,
  },
  (t) => [index('triage_events_practice_idx').on(t.practiceId)],
);

export const appointmentTypesRelations = relations(appointmentTypes, ({ one }) => ({
  practice: one(practices, {
    fields: [appointmentTypes.practiceId],
    references: [practices.id],
  }),
}));

export const appointmentsRelations = relations(appointments, ({ one, many }) => ({
  location: one(practiceLocations, {
    fields: [appointments.locationId],
    references: [practiceLocations.id],
  }),
  practitioner: one(practitioners, {
    fields: [appointments.practitionerId],
    references: [practitioners.id],
  }),
  appointmentType: one(appointmentTypes, {
    fields: [appointments.appointmentTypeId],
    references: [appointmentTypes.id],
  }),
  statusHistory: many(appointmentStatusHistory),
}));
