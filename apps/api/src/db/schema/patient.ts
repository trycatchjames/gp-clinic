import { relations } from 'drizzle-orm';
import {
  boolean,
  date,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { id, timestamps, version } from './_shared';
import {
  alertCategoryEnum,
  alertSeverityEnum,
  atsiStatusEnum,
  consentTypeEnum,
  dvaCardColourEnum,
  myMedicareStatusEnum,
  patientStatusEnum,
} from './enums';
import { practices } from './practice';
import { practitioners } from './practitioner';

export const patients = pgTable(
  'patients',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),

    title: text('title'),
    familyName: text('family_name').notNull(),
    givenNames: text('given_names').notNull(),
    preferredName: text('preferred_name'),
    dateOfBirth: date('date_of_birth').notNull(),
    sexAtBirth: text('sex_at_birth'),
    genderIdentity: text('gender_identity'),
    pronouns: text('pronouns'),

    mobile: text('mobile'),
    homePhone: text('home_phone'),
    workPhone: text('work_phone'),
    email: text('email'),
    residentialAddress: text('residential_address'),
    suburb: text('suburb'),
    state: text('state'),
    postcode: text('postcode'),
    postalAddress: text('postal_address'),
    contactDetailsConfirmedAt: timestamp('contact_details_confirmed_at', {
      withTimezone: true,
    }),

    /**
     * Asked of every patient — drives MBS item 715, the ATSI immunisation schedule
     * and the PIP Indigenous Health Incentive. "not_stated" is valid; blank is not.
     */
    atsiStatus: atsiStatusEnum('atsi_status').default('not_stated').notNull(),
    countryOfBirth: text('country_of_birth'),
    preferredLanguage: text('preferred_language'),
    interpreterRequired: boolean('interpreter_required').default(false).notNull(),

    usualPractitionerId: uuid('usual_practitioner_id').references(() => practitioners.id),

    status: patientStatusEnum('status').default('active').notNull(),
    deceasedOn: date('deceased_on'),
    deceasedSource: text('deceased_source'),
    /** Set when this record was merged into another. Redirects lookups. */
    mergedIntoPatientId: uuid('merged_into_patient_id'),

    version: version(),
    ...timestamps,
  },
  (t) => [
    index('patients_practice_idx').on(t.practiceId),
    index('patients_name_dob_idx').on(t.practiceId, t.familyName, t.dateOfBirth),
  ],
);

export const patientEntitlements = pgTable(
  'patient_entitlements',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    patientId: uuid('patient_id')
      .notNull()
      .references(() => patients.id, { onDelete: 'cascade' })
      .unique(),

    medicareNumber: text('medicare_number'),
    medicareIrn: text('medicare_irn'),
    medicareExpiresOn: date('medicare_expires_on'),
    medicareVerifiedAt: timestamp('medicare_verified_at', { withTimezone: true }),
    medicareVerificationMethod: text('medicare_verification_method'),

    dvaFileNumber: text('dva_file_number'),
    dvaCardColour: dvaCardColourEnum('dva_card_colour'),

    concessionCardType: text('concession_card_type'),
    concessionCardNumber: text('concession_card_number'),
    concessionExpiresOn: date('concession_expires_on'),

    privateHealthFund: text('private_health_fund'),
    privateHealthMembership: text('private_health_membership'),

    individualHealthcareIdentifier: text('individual_healthcare_identifier'),

    version: version(),
    ...timestamps,
  },
  (t) => [index('patient_entitlements_patient_idx').on(t.patientId)],
);

/**
 * MyMedicare registration. Gates chronic condition management items, longer
 * telehealth, GPACI, and from 1 Nov 2025 bulk billing incentive eligibility.
 */
export const patientMyMedicareRegistrations = pgTable(
  'patient_mymedicare_registrations',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    patientId: uuid('patient_id')
      .notNull()
      .references(() => patients.id, { onDelete: 'cascade' }),
    status: myMedicareStatusEnum('status').default('not_registered').notNull(),
    preferredPractitionerId: uuid('preferred_practitioner_id').references(
      () => practitioners.id,
    ),
    registeredOn: date('registered_on'),
    withdrawnOn: date('withdrawn_on'),
    consentRecordedByUserId: uuid('consent_recorded_by_user_id'),
    consentRecordedAt: timestamp('consent_recorded_at', { withTimezone: true }),
    source: text('source').default('manual_entry').notNull(),
    ...timestamps,
  },
  (t) => [index('mymedicare_patient_idx').on(t.patientId)],
);

/**
 * Alerts are split by who can see them. Reception never sees a clinical alert.
 * See docs/20-patient-management/01-patient-registration.md.
 */
export const patientAlerts = pgTable(
  'patient_alerts',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    patientId: uuid('patient_id')
      .notNull()
      .references(() => patients.id, { onDelete: 'cascade' }),
    category: alertCategoryEnum('category').notNull(),
    severity: alertSeverityEnum('severity').default('info').notNull(),
    text: text('text').notNull(),
    reviewOn: date('review_on'),
    isActive: boolean('is_active').default(true).notNull(),
    ...timestamps,
  },
  (t) => [index('patient_alerts_patient_idx').on(t.patientId, t.category)],
);

/** Consent is explicit, per type, and checked at the moment of use. */
export const consents = pgTable(
  'consents',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    patientId: uuid('patient_id')
      .notNull()
      .references(() => patients.id, { onDelete: 'cascade' }),
    consentType: consentTypeEnum('consent_type').notNull(),
    granted: boolean('granted').notNull(),
    grantedAt: timestamp('granted_at', { withTimezone: true }),
    withdrawnAt: timestamp('withdrawn_at', { withTimezone: true }),
    scope: text('scope'),
    recordedByUserId: uuid('recorded_by_user_id'),
    notes: text('notes'),
    ...timestamps,
  },
  (t) => [index('consents_patient_type_idx').on(t.patientId, t.consentType)],
);

export const patientsRelations = relations(patients, ({ one, many }) => ({
  practice: one(practices, {
    fields: [patients.practiceId],
    references: [practices.id],
  }),
  usualPractitioner: one(practitioners, {
    fields: [patients.usualPractitionerId],
    references: [practitioners.id],
  }),
  entitlements: one(patientEntitlements),
  alerts: many(patientAlerts),
  consents: many(consents),
}));
