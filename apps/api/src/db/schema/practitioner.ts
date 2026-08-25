import { relations } from 'drizzle-orm';
import {
  boolean,
  date,
  index,
  integer,
  pgTable,
  text,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { id, timestamps, version } from './_shared';
import {
  ahpraRegistrationTypeEnum,
  practitionerKindEnum,
  qualificationTypeEnum,
  remunerationModelEnum,
  supervisionLevelEnum,
  trainingTermEnum,
  workingArrangementEnum,
} from './enums';
import { practices, practiceLocations } from './practice';

/**
 * A person who provides care, whether or not they log in.
 * See docs/10-practice-setup/03-practitioners-and-credentialing.md.
 */
export const practitioners = pgTable(
  'practitioners',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),

    title: text('title'),
    givenName: text('given_name').notNull(),
    familyName: text('family_name').notNull(),
    preferredName: text('preferred_name'),
    /** Recorded because some patients require a practitioner of a particular gender. */
    gender: text('gender'),
    dateOfBirth: date('date_of_birth'),
    email: text('email'),
    mobile: text('mobile'),

    kind: practitionerKindEnum('kind').notNull(),

    ahpraRegistrationNumber: text('ahpra_registration_number'),
    ahpraRegistrationType: ahpraRegistrationTypeEnum('ahpra_registration_type'),
    ahpraProfession: text('ahpra_profession'),
    ahpraSpecialty: text('ahpra_specialty'),
    ahpraConditions: text('ahpra_conditions'),
    ahpraExpiresOn: date('ahpra_expires_on'),

    /** Healthcare Provider Identifier — Individual. */
    hpiI: text('hpi_i'),
    prescriberNumber: text('prescriber_number'),

    /** Specialist recognition. Gates the higher (A1) MBS fee tier. */
    vocationalRegistration: boolean('vocational_registration').default(false).notNull(),
    /**
     * GPMHSC-accredited Mental Health Skills Training.
     * Gates MBS items 2715 and 2717. See docs/40-clinical/10-mental-health.md.
     */
    mentalHealthSkillsTraining: boolean('mental_health_skills_training')
      .default(false)
      .notNull(),
    /** Whether this practitioner may supervise registrars. */
    isSupervisor: boolean('is_supervisor').default(false).notNull(),

    workingArrangement: workingArrangementEnum('working_arrangement'),
    indemnityInsurer: text('indemnity_insurer'),
    indemnityPolicyNumber: text('indemnity_policy_number'),
    indemnityExpiresOn: date('indemnity_expires_on'),

    isActive: boolean('is_active').default(true).notNull(),
    version: version(),
    ...timestamps,
  },
  (t) => [
    index('practitioners_practice_idx').on(t.practiceId),
    index('practitioners_kind_idx').on(t.practiceId, t.kind),
  ],
);

/**
 * Medicare provider numbers are issued per practitioner PER LOCATION.
 * Billing at the wrong site with the wrong number is a rejected claim.
 */
export const practitionerLocations = pgTable(
  'practitioner_locations',
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
    providerNumber: text('provider_number'),
    isActive: boolean('is_active').default(true).notNull(),
    ...timestamps,
  },
  (t) => [
    uniqueIndex('practitioner_locations_unique').on(t.practitionerId, t.locationId),
    index('practitioner_locations_location_idx').on(t.locationId),
  ],
);

/** Qualifications and training, with expiry tracking. RACGP GP3.1. */
export const practitionerQualifications = pgTable(
  'practitioner_qualifications',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    practitionerId: uuid('practitioner_id')
      .notNull()
      .references(() => practitioners.id, { onDelete: 'cascade' }),
    qualificationType: qualificationTypeEnum('qualification_type').notNull(),
    description: text('description'),
    issuingBody: text('issuing_body'),
    obtainedOn: date('obtained_on'),
    expiresOn: date('expires_on'),
    evidenceDocumentId: uuid('evidence_document_id'),
    ...timestamps,
  },
  (t) => [index('practitioner_qualifications_practitioner_idx').on(t.practitionerId)],
);

/** Registrar supervision. A registrar cannot be activated without one. */
export const supervisionRelationships = pgTable(
  'supervision_relationships',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    registrarId: uuid('registrar_id')
      .notNull()
      .references(() => practitioners.id, { onDelete: 'cascade' }),
    supervisorId: uuid('supervisor_id')
      .notNull()
      .references(() => practitioners.id, { onDelete: 'cascade' }),
    supervisionLevel: supervisionLevelEnum('supervision_level').notNull(),
    trainingTerm: trainingTermEnum('training_term'),
    trainingOrganisation: text('training_organisation'),
    effectiveFrom: date('effective_from').notNull(),
    effectiveTo: date('effective_to'),
    ...timestamps,
  },
  (t) => [index('supervision_registrar_idx').on(t.registrarId)],
);

/** How a practitioner is paid. Versioned by effective date. */
export const practitionerRemuneration = pgTable(
  'practitioner_remuneration',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    practitionerId: uuid('practitioner_id')
      .notNull()
      .references(() => practitioners.id, { onDelete: 'cascade' }),
    model: remunerationModelEnum('model').notNull(),
    /** Basis points, so 6500 = 65.00%. */
    percentageBp: integer('percentage_bp'),
    ofGross: boolean('of_gross').default(true).notNull(),
    serviceFeePercentageBp: integer('service_fee_percentage_bp'),
    sessionRateCents: integer('session_rate_cents'),
    annualSalaryCents: integer('annual_salary_cents'),
    effectiveFrom: date('effective_from').notNull(),
    effectiveTo: date('effective_to'),
    ...timestamps,
  },
  (t) => [index('practitioner_remuneration_practitioner_idx').on(t.practitionerId)],
);

export const practitionersRelations = relations(practitioners, ({ one, many }) => ({
  practice: one(practices, {
    fields: [practitioners.practiceId],
    references: [practices.id],
  }),
  locations: many(practitionerLocations),
  qualifications: many(practitionerQualifications),
}));

export const practitionerLocationsRelations = relations(
  practitionerLocations,
  ({ one }) => ({
    practitioner: one(practitioners, {
      fields: [practitionerLocations.practitionerId],
      references: [practitioners.id],
    }),
    location: one(practiceLocations, {
      fields: [practitionerLocations.locationId],
      references: [practiceLocations.id],
    }),
  }),
);
