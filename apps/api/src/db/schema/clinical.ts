import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { id, timestamps, version } from './_shared';
import {
  carePlanTypeEnum,
  conditionStatusEnum,
  encounterTypeEnum,
  recallPriorityEnum,
  recallStatusEnum,
  resultActionEnum,
} from './enums';
import { practices, practiceLocations } from './practice';
import { practitioners } from './practitioner';
import { patients } from './patient';
import { appointments } from './scheduling';

/** One episode of care with one practitioner. Duration drives MBS time tiering. */
export const encounters = pgTable(
  'encounters',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    locationId: uuid('location_id')
      .notNull()
      .references(() => practiceLocations.id),
    patientId: uuid('patient_id')
      .notNull()
      .references(() => patients.id),
    practitionerId: uuid('practitioner_id')
      .notNull()
      .references(() => practitioners.id),
    appointmentId: uuid('appointment_id').references(() => appointments.id),
    encounterType: encounterTypeEnum('encounter_type').default('consultation').notNull(),
    startedAt: timestamp('started_at', { withTimezone: true }).notNull(),
    endedAt: timestamp('ended_at', { withTimezone: true }),
    durationMinutes: integer('duration_minutes'),
    supervisorReviewRequested: boolean('supervisor_review_requested')
      .default(false)
      .notNull(),
    supervisorReviewedAt: timestamp('supervisor_reviewed_at', { withTimezone: true }),
    supervisorReviewedBy: uuid('supervisor_reviewed_by'),
    version: version(),
    ...timestamps,
  },
  (t) => [
    index('encounters_patient_idx').on(t.patientId),
    index('encounters_practitioner_idx').on(t.practitionerId, t.startedAt),
  ],
);

/**
 * The consultation note. Structured but not a straitjacket — the Murtagh
 * scaffolding fields are optional and default on only for registrars.
 */
export const clinicalNotes = pgTable(
  'clinical_notes',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    encounterId: uuid('encounter_id')
      .notNull()
      .references(() => encounters.id, { onDelete: 'cascade' }),

    reasonForEncounter: text('reason_for_encounter'),
    history: text('history'),
    examination: text('examination'),
    assessment: text('assessment'),
    noAssessmentReason: text('no_assessment_reason'),
    plan: text('plan'),
    /** A distinct field, prompted for, never buried in the plan. */
    safetyNetting: text('safety_netting'),
    safetyNettingPromptDeclined: boolean('safety_netting_prompt_declined')
      .default(false)
      .notNull(),

    // Murtagh's safe diagnostic strategy
    probabilityDiagnosis: text('probability_diagnosis'),
    seriousNotToMiss: text('serious_not_to_miss'),
    commonlyMissed: text('commonly_missed'),
    masqueradesConsidered: jsonb('masquerades_considered').$type<string[]>(),
    patientAgenda: text('patient_agenda'),

    signedAt: timestamp('signed_at', { withTimezone: true }),
    signedBy: uuid('signed_by'),
    version: version(),
    ...timestamps,
  },
  (t) => [index('clinical_notes_encounter_idx').on(t.encounterId)],
);

/** A signed note is immutable. Corrections are appended, never overwritten. */
export const noteAmendments = pgTable(
  'note_amendments',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    clinicalNoteId: uuid('clinical_note_id')
      .notNull()
      .references(() => clinicalNotes.id, { onDelete: 'cascade' }),
    amendmentText: text('amendment_text').notNull(),
    reason: text('reason').notNull(),
    authorUserId: uuid('author_user_id').notNull(),
    amendedAt: timestamp('amended_at', { withTimezone: true }).defaultNow().notNull(),
    ...timestamps,
  },
  (t) => [index('note_amendments_note_idx').on(t.clinicalNoteId)],
);

export const conditions = pgTable(
  'conditions',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    patientId: uuid('patient_id')
      .notNull()
      .references(() => patients.id, { onDelete: 'cascade' }),
    code: text('code'),
    codeSystem: text('code_system').default('snomed-ct-au'),
    displayText: text('display_text').notNull(),
    status: conditionStatusEnum('status').default('active').notNull(),
    isChronic: boolean('is_chronic').default(false).notNull(),
    onsetOn: date('onset_on'),
    resolvedOn: date('resolved_on'),
    inactiveReason: text('inactive_reason'),
    recordedInEncounterId: uuid('recorded_in_encounter_id').references(() => encounters.id),
    ...timestamps,
  },
  (t) => [index('conditions_patient_idx').on(t.patientId, t.status)],
);

export const allergies = pgTable(
  'allergies',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    patientId: uuid('patient_id')
      .notNull()
      .references(() => patients.id, { onDelete: 'cascade' }),
    /** "Nil known" is a valid recorded state; blank is not. */
    isNilKnown: boolean('is_nil_known').default(false).notNull(),
    substance: text('substance'),
    reaction: text('reaction'),
    severity: text('severity'),
    recordedOn: date('recorded_on'),
    ...timestamps,
  },
  (t) => [index('allergies_patient_idx').on(t.patientId)],
);

export const medications = pgTable(
  'medications',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    patientId: uuid('patient_id')
      .notNull()
      .references(() => patients.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    form: text('form'),
    strength: text('strength'),
    dose: text('dose'),
    frequency: text('frequency'),
    route: text('route'),
    indication: text('indication'),
    startedOn: date('started_on'),
    ceasedOn: date('ceased_on'),
    ceasedReason: text('ceased_reason'),
    isCurrent: boolean('is_current').default(true).notNull(),
    lastReconciledAt: timestamp('last_reconciled_at', { withTimezone: true }),
    ...timestamps,
  },
  (t) => [index('medications_patient_idx').on(t.patientId, t.isCurrent)],
);

export const observations = pgTable(
  'observations',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    patientId: uuid('patient_id')
      .notNull()
      .references(() => patients.id, { onDelete: 'cascade' }),
    encounterId: uuid('encounter_id').references(() => encounters.id),
    code: text('code').notNull(),
    displayText: text('display_text').notNull(),
    valueNumeric: text('value_numeric'),
    valueText: text('value_text'),
    unit: text('unit'),
    observedAt: timestamp('observed_at', { withTimezone: true }).defaultNow().notNull(),
    ...timestamps,
  },
  (t) => [index('observations_patient_code_idx').on(t.patientId, t.code)],
);

/** An ordered test, tracked from the moment it is ordered. */
export const investigationRequests = pgTable(
  'investigation_requests',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    patientId: uuid('patient_id')
      .notNull()
      .references(() => patients.id, { onDelete: 'cascade' }),
    encounterId: uuid('encounter_id').references(() => encounters.id),
    orderingPractitionerId: uuid('ordering_practitioner_id')
      .notNull()
      .references(() => practitioners.id),
    modality: text('modality').notNull(),
    tests: jsonb('tests').$type<string[]>().default([]).notNull(),
    clinicalIndication: text('clinical_indication').notNull(),
    clinicalQuestion: text('clinical_question'),
    urgency: text('urgency').default('routine').notNull(),
    providerName: text('provider_name'),
    expectedReturnByDate: date('expected_return_by_date'),
    closedAt: timestamp('closed_at', { withTimezone: true }),
    closedReason: text('closed_reason'),
    ...timestamps,
  },
  (t) => [
    index('investigation_requests_patient_idx').on(t.patientId),
    index('investigation_requests_outstanding_idx').on(t.practiceId, t.closedAt),
  ],
);

export const results = pgTable(
  'results',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    patientId: uuid('patient_id').references(() => patients.id),
    investigationRequestId: uuid('investigation_request_id').references(
      () => investigationRequests.id,
    ),
    orderingPractitionerId: uuid('ordering_practitioner_id').references(
      () => practitioners.id,
    ),
    receivedAt: timestamp('received_at', { withTimezone: true }).defaultNow().notNull(),
    reportText: text('report_text'),
    isCriticalFlagged: boolean('is_critical_flagged').default(false).notNull(),
    /** Every result requires an explicit action. There is no "mark as read". */
    action: resultActionEnum('action'),
    actionReason: text('action_reason'),
    actionedAt: timestamp('actioned_at', { withTimezone: true }),
    actionedBy: uuid('actioned_by'),
    acknowledgedAt: timestamp('acknowledged_at', { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    index('results_practitioner_idx').on(t.orderingPractitionerId, t.actionedAt),
    index('results_unmatched_idx').on(t.practiceId, t.patientId),
  ],
);

/**
 * A recall is a duty to pursue. A reminder is a prompt with no duty.
 * They are deliberately separate tables. See spec/domain/result.md and spec/domain/recall.md.
 */
export const recalls = pgTable(
  'recalls',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    patientId: uuid('patient_id')
      .notNull()
      .references(() => patients.id, { onDelete: 'cascade' }),
    responsiblePractitionerId: uuid('responsible_practitioner_id')
      .notNull()
      .references(() => practitioners.id),
    resultId: uuid('result_id').references(() => results.id),
    reason: text('reason').notNull(),
    priority: recallPriorityEnum('priority').default('routine').notNull(),
    dueOn: date('due_on').notNull(),
    status: recallStatusEnum('status').default('open').notNull(),
    escalationStep: integer('escalation_step').default(0).notNull(),
    closedAt: timestamp('closed_at', { withTimezone: true }),
    closedBy: uuid('closed_by'),
    closureReason: text('closure_reason'),
    ...timestamps,
  },
  (t) => [
    index('recalls_patient_idx').on(t.patientId),
    index('recalls_open_idx').on(t.practiceId, t.status, t.dueOn),
  ],
);

/** Every attempt, including failures. "We tried" is not defensible on its own. */
export const recallContactAttempts = pgTable(
  'recall_contact_attempts',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    recallId: uuid('recall_id')
      .notNull()
      .references(() => recalls.id, { onDelete: 'cascade' }),
    channel: text('channel').notNull(),
    attemptedAt: timestamp('attempted_at', { withTimezone: true }).defaultNow().notNull(),
    attemptedByUserId: uuid('attempted_by_user_id'),
    outcome: text('outcome').notNull(),
    notes: text('notes'),
    ...timestamps,
  },
  (t) => [index('recall_attempts_recall_idx').on(t.recallId)],
);

/** Population health prompts. No duty to pursue, patient can opt out entirely. */
export const reminders = pgTable(
  'reminders',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    patientId: uuid('patient_id')
      .notNull()
      .references(() => patients.id, { onDelete: 'cascade' }),
    activityKey: text('activity_key').notNull(),
    description: text('description').notNull(),
    dueOn: date('due_on').notNull(),
    completedOn: date('completed_on'),
    declinedOn: date('declined_on'),
    declinedReason: text('declined_reason'),
    notApplicableReason: text('not_applicable_reason'),
    reviewOn: date('review_on'),
    ...timestamps,
  },
  (t) => [index('reminders_due_idx').on(t.practiceId, t.dueOn)],
);

export const carePlans = pgTable(
  'care_plans',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    patientId: uuid('patient_id')
      .notNull()
      .references(() => patients.id, { onDelete: 'cascade' }),
    practitionerId: uuid('practitioner_id')
      .notNull()
      .references(() => practitioners.id),
    planType: carePlanTypeEnum('plan_type').notNull(),
    /** Legacy GPMP/TCA plans keep allied health access until 1 July 2027. */
    isLegacyFramework: boolean('is_legacy_framework').default(false).notNull(),
    preparedOn: date('prepared_on').notNull(),
    reviewDueOn: date('review_due_on'),
    patientGoals: text('patient_goals'),
    clinicalGoals: text('clinical_goals'),
    managementActions: text('management_actions'),
    copyGivenToPatientAt: timestamp('copy_given_to_patient_at', { withTimezone: true }),
    alliedHealthAllocationTotal: integer('allied_health_allocation_total'),
    alliedHealthAllocationUsed: integer('allied_health_allocation_used')
      .default(0)
      .notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    version: version(),
    ...timestamps,
  },
  (t) => [index('care_plans_patient_idx').on(t.patientId, t.isActive)],
);

export const referrals = pgTable(
  'referrals',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    patientId: uuid('patient_id')
      .notNull()
      .references(() => patients.id, { onDelete: 'cascade' }),
    encounterId: uuid('encounter_id').references(() => encounters.id),
    referringPractitionerId: uuid('referring_practitioner_id')
      .notNull()
      .references(() => practitioners.id),
    carePlanId: uuid('care_plan_id').references(() => carePlans.id),
    recipientName: text('recipient_name').notNull(),
    recipientSpecialty: text('recipient_specialty'),
    reason: text('reason').notNull(),
    clinicalQuestion: text('clinical_question').notNull(),
    urgency: text('urgency').default('routine').notNull(),
    isIndefinite: boolean('is_indefinite').default(false).notNull(),
    validUntil: date('valid_until'),
    sentAt: timestamp('sent_at', { withTimezone: true }),
    receiptConfirmedAt: timestamp('receipt_confirmed_at', { withTimezone: true }),
    expectedReplyBy: date('expected_reply_by'),
    closedAt: timestamp('closed_at', { withTimezone: true }),
    closureReason: text('closure_reason'),
    ...timestamps,
  },
  (t) => [
    index('referrals_patient_idx').on(t.patientId),
    index('referrals_open_idx').on(t.practiceId, t.closedAt),
  ],
);

export const immunisations = pgTable(
  'immunisations',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    patientId: uuid('patient_id')
      .notNull()
      .references(() => patients.id, { onDelete: 'cascade' }),
    encounterId: uuid('encounter_id').references(() => encounters.id),
    vaccineName: text('vaccine_name').notNull(),
    /** Mandatory: a batch recall must identify affected patients in minutes. */
    batchNumber: text('batch_number').notNull(),
    expiresOn: date('expires_on'),
    doseNumber: integer('dose_number'),
    route: text('route'),
    site: text('site').notNull(),
    administeredAt: timestamp('administered_at', { withTimezone: true }).notNull(),
    administeredByPractitionerId: uuid('administered_by_practitioner_id')
      .notNull()
      .references(() => practitioners.id),
    observationStartedAt: timestamp('observation_started_at', { withTimezone: true }),
    observationCompletedAt: timestamp('observation_completed_at', { withTimezone: true }),
    observationExceptionReason: text('observation_exception_reason'),
    reportedToRegisterAt: timestamp('reported_to_register_at', { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    index('immunisations_patient_idx').on(t.patientId),
    index('immunisations_batch_idx').on(t.practiceId, t.batchNumber),
  ],
);

export const documents = pgTable(
  'documents',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    patientId: uuid('patient_id').references(() => patients.id),
    category: text('category').notNull(),
    title: text('title').notNull(),
    sourceName: text('source_name'),
    receivedAt: timestamp('received_at', { withTimezone: true }).defaultNow().notNull(),
    routedToPractitionerId: uuid('routed_to_practitioner_id').references(
      () => practitioners.id,
    ),
    referralId: uuid('referral_id').references(() => referrals.id),
    /** Tracked to actioned, not to read. */
    actionedAt: timestamp('actioned_at', { withTimezone: true }),
    actionedBy: uuid('actioned_by'),
    actionSummary: text('action_summary'),
    storagePath: text('storage_path'),
    ...timestamps,
  },
  (t) => [
    index('documents_patient_idx').on(t.patientId),
    index('documents_unmatched_idx').on(t.practiceId, t.patientId),
  ],
);
