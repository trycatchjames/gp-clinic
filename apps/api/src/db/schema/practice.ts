import { relations } from 'drizzle-orm';
import {
  boolean,
  date,
  index,
  integer,
  pgTable,
  text,
  time,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { id, timestamps, version } from './_shared';
import {
  accreditationStatusEnum,
  afterHoursArrangementEnum,
  australianStateEnum,
  billingPolicyEnum,
  dayOfWeekEnum,
  entityTypeEnum,
  myMedicareStatusEnum,
  onboardingStatusEnum,
  onboardingStepEnum,
  practiceTypeEnum,
  publicHolidayBehaviourEnum,
  stepStatusEnum,
} from './enums';

/**
 * The tenant. Every non-reference row in the system carries a practice_id.
 * See docs/00-foundations/03-domain-model.md.
 */
export const practices = pgTable(
  'practices',
  {
    id: id(),
    legalName: text('legal_name').notNull(),
    tradingName: text('trading_name').notNull(),
    entityType: entityTypeEnum('entity_type').notNull(),
    practiceType: practiceTypeEnum('practice_type').default('general_practice').notNull(),
    /** Validated with the ATO modulus 89 checksum. Not verified against the ABR. */
    abn: text('abn'),
    acn: text('acn'),
    contactEmail: text('contact_email'),
    contactPhone: text('contact_phone'),
    website: text('website'),
    onboardingStatus: onboardingStatusEnum('onboarding_status')
      .default('in_progress')
      .notNull(),
    activatedAt: timestamp('activated_at', { withTimezone: true }),
    deactivatedAt: timestamp('deactivated_at', { withTimezone: true }),
    version: version(),
    ...timestamps,
  },
  (t) => [index('practices_trading_name_idx').on(t.tradingName)],
);

/**
 * Where care happens. Mirrors the HI Service seed / network organisation model:
 * provider numbers, books, banking and fee schedules are all location-scoped.
 */
export const practiceLocations = pgTable(
  'practice_locations',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    isPrimary: boolean('is_primary').default(false).notNull(),
    isActive: boolean('is_active').default(true).notNull(),

    streetAddress: text('street_address').notNull(),
    suburb: text('suburb').notNull(),
    state: australianStateEnum('state').notNull(),
    postcode: text('postcode').notNull(),
    postalAddress: text('postal_address'),

    /** Chosen explicitly rather than inferred from the state. Broken Hill exists. */
    timezone: text('timezone').notNull(),

    phone: text('phone'),
    afterHoursPhone: text('after_hours_phone'),
    fax: text('fax'),
    email: text('email'),

    /** Healthcare Provider Identifier — Organisation. */
    hpiO: text('hpi_o'),
    /** Medicare Minor Customer ID, used for claiming and banking. */
    medicareMinorId: text('medicare_minor_id'),

    afterHoursArrangement: afterHoursArrangementEnum('after_hours_arrangement'),
    afterHoursProviderName: text('after_hours_provider_name'),
    afterHoursContact: text('after_hours_contact'),
    afterHoursNotes: text('after_hours_notes'),

    publicHolidayBehaviour: publicHolidayBehaviourEnum('public_holiday_behaviour')
      .default('closed')
      .notNull(),

    /** RACGP C2.3 accessibility and GP5.1 facilities. */
    wheelchairAccess: boolean('wheelchair_access').default(false).notNull(),
    accessibleToilet: boolean('accessible_toilet').default(false).notNull(),
    hearingLoop: boolean('hearing_loop').default(false).notNull(),
    onSiteParking: boolean('on_site_parking').default(false).notNull(),
    publicTransportNearby: boolean('public_transport_nearby').default(false).notNull(),
    treatmentRoom: boolean('treatment_room').default(false).notNull(),
    procedureRoom: boolean('procedure_room').default(false).notNull(),
    onSitePathologyCollection: boolean('on_site_pathology_collection')
      .default(false)
      .notNull(),

    defaultFeeScheduleId: uuid('default_fee_schedule_id'),
    version: version(),
    ...timestamps,
  },
  (t) => [index('practice_locations_practice_idx').on(t.practiceId)],
);

export const locationBusinessHours = pgTable(
  'location_business_hours',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    locationId: uuid('location_id')
      .notNull()
      .references(() => practiceLocations.id, { onDelete: 'cascade' }),
    dayOfWeek: dayOfWeekEnum('day_of_week').notNull(),
    isOpen: boolean('is_open').default(true).notNull(),
    opensAt: time('opens_at'),
    closesAt: time('closes_at'),
    breakStartsAt: time('break_starts_at'),
    breakEndsAt: time('break_ends_at'),
    ...timestamps,
  },
  (t) => [uniqueIndex('location_hours_unique').on(t.locationId, t.dayOfWeek)],
);

export const locationClosures = pgTable(
  'location_closures',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    locationId: uuid('location_id')
      .notNull()
      .references(() => practiceLocations.id, { onDelete: 'cascade' }),
    startsOn: date('starts_on').notNull(),
    endsOn: date('ends_on').notNull(),
    reason: text('reason').notNull(),
    patientMessage: text('patient_message'),
    ...timestamps,
  },
  (t) => [index('location_closures_location_idx').on(t.locationId)],
);

/**
 * Programme registrations and identifiers held at practice level.
 * BBPIP requires MyMedicare registration and obliges the practice to bulk bill
 * 100% of eligible services. See docs/50-billing/02-medicare-bulk-billing.md.
 */
export const practiceRegistrations = pgTable('practice_registrations', {
  id: id(),
  practiceId: uuid('practice_id')
    .notNull()
    .references(() => practices.id, { onDelete: 'cascade' })
    .unique(),

  prodaOrganisationName: text('proda_organisation_name'),
  prodaRaNumber: text('proda_ra_number'),

  myMedicareStatus: myMedicareStatusEnum('mymedicare_status')
    .default('not_registered')
    .notNull(),
  myMedicareRegisteredOn: date('mymedicare_registered_on'),

  /** Bulk Billing Practice Incentive Program — from 1 November 2025. */
  bbpipParticipating: boolean('bbpip_participating').default(false).notNull(),
  bbpipEffectiveFrom: date('bbpip_effective_from'),
  bbpipEffectiveTo: date('bbpip_effective_to'),

  accreditationStatus: accreditationStatusEnum('accreditation_status')
    .default('not_accredited')
    .notNull(),
  accreditingBody: text('accrediting_body'),
  accreditationExpiresOn: date('accreditation_expires_on'),

  pipParticipating: boolean('pip_participating').default(false).notNull(),
  wipParticipating: boolean('wip_participating').default(false).notNull(),

  version: version(),
  ...timestamps,
});

/** Practice-level billing configuration. */
export const practiceBillingSettings = pgTable('practice_billing_settings', {
  id: id(),
  practiceId: uuid('practice_id')
    .notNull()
    .references(() => practices.id, { onDelete: 'cascade' })
    .unique(),
  billingPolicy: billingPolicyEnum('billing_policy').default('mixed').notNull(),
  /** Private schedule = MBS schedule fee × multiplier, rounded. */
  privateFeeMultiplier: integer('private_fee_multiplier_bp').default(17500).notNull(),
  privateFeeRoundingCents: integer('private_fee_rounding_cents').default(500).notNull(),
  suggestBulkBillIncentives: boolean('suggest_bulk_bill_incentives')
    .default(true)
    .notNull(),
  version: version(),
  ...timestamps,
});

/** Which patient cohorts a mixed-billing practice bulk bills. */
export const billingCohortRules = pgTable(
  'billing_cohort_rules',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    cohort: text('cohort').notNull(),
    bulkBill: boolean('bulk_bill').default(true).notNull(),
    ...timestamps,
  },
  (t) => [uniqueIndex('billing_cohort_rules_unique').on(t.practiceId, t.cohort)],
);

/** Resumable onboarding state, saved on every step transition. */
export const onboardingProgress = pgTable(
  'onboarding_progress',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    step: onboardingStepEnum('step').notNull(),
    status: stepStatusEnum('status').default('not_started').notNull(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    ...timestamps,
  },
  (t) => [uniqueIndex('onboarding_progress_unique').on(t.practiceId, t.step)],
);

export const practicesRelations = relations(practices, ({ many, one }) => ({
  locations: many(practiceLocations),
  registrations: one(practiceRegistrations),
  billingSettings: one(practiceBillingSettings),
  onboarding: many(onboardingProgress),
}));

export const practiceLocationsRelations = relations(
  practiceLocations,
  ({ one, many }) => ({
    practice: one(practices, {
      fields: [practiceLocations.practiceId],
      references: [practices.id],
    }),
    businessHours: many(locationBusinessHours),
    closures: many(locationClosures),
  }),
);
