import { pgEnum } from 'drizzle-orm/pg-core';

// --- identity and access ----------------------------------------------------
export const practiceRoleEnum = pgEnum('practice_role', [
  'practice_owner',
  'practice_manager',
  'general_practitioner',
  'gp_registrar',
  'practice_nurse',
  'allied_health',
  'receptionist',
  'practice_admin',
]);

export const membershipStatusEnum = pgEnum('membership_status', [
  'active',
  'suspended',
  'removed',
]);

export const invitationStatusEnum = pgEnum('invitation_status', [
  'pending',
  'accepted',
  'revoked',
  'expired',
]);

// --- practice ---------------------------------------------------------------
export const entityTypeEnum = pgEnum('entity_type', [
  'sole_trader',
  'company',
  'partnership',
  'trust',
  'aboriginal_community_controlled',
  'other',
]);

export const practiceTypeEnum = pgEnum('practice_type', [
  'general_practice',
  'aboriginal_community_controlled_health_service',
  'after_hours_service',
  'corporate_group',
]);

export const onboardingStatusEnum = pgEnum('onboarding_status', [
  'in_progress',
  'active',
  'suspended',
  'closed',
]);

export const onboardingStepEnum = pgEnum('onboarding_step', [
  'practice_identity',
  'primary_location',
  'opening_hours',
  'registrations',
  'team',
  'appointment_types',
  'billing_setup',
  'review',
]);

export const stepStatusEnum = pgEnum('step_status', [
  'not_started',
  'in_progress',
  'complete',
  'skipped',
]);

export const australianStateEnum = pgEnum('australian_state', [
  'NSW',
  'VIC',
  'QLD',
  'SA',
  'WA',
  'TAS',
  'NT',
  'ACT',
]);

export const afterHoursArrangementEnum = pgEnum('after_hours_arrangement', [
  'own_practitioners',
  'cooperative',
  'deputising_service',
  'hospital_ed_referral',
]);

export const dayOfWeekEnum = pgEnum('day_of_week', [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
]);

export const publicHolidayBehaviourEnum = pgEnum('public_holiday_behaviour', [
  'closed',
  'open_normal',
  'open_reduced',
]);

export const accreditationStatusEnum = pgEnum('accreditation_status', [
  'not_accredited',
  'in_progress',
  'accredited',
  'lapsed',
]);

export const myMedicareStatusEnum = pgEnum('mymedicare_status', [
  'not_registered',
  'registration_in_progress',
  'registered',
]);

// --- practitioner -----------------------------------------------------------
export const practitionerKindEnum = pgEnum('practitioner_kind', [
  'gp',
  'gp_registrar',
  'nurse',
  'nurse_practitioner',
  'midwife',
  'allied_health',
  'practice_pharmacist',
  'aboriginal_health_practitioner',
]);

export const ahpraRegistrationTypeEnum = pgEnum('ahpra_registration_type', [
  'general',
  'specialist',
  'limited',
  'provisional',
  'non_practising',
]);

export const qualificationTypeEnum = pgEnum('qualification_type', [
  'fellowship_racgp',
  'fellowship_acrrm',
  'mental_health_skills_training',
  'focussed_psychological_strategies',
  'cpr',
  'anaphylaxis',
  'immunisation_provider',
  'cervical_screening',
  'iud_insertion',
  'implant_insertion',
  'skin_procedures',
  'spirometry',
  'other',
]);

export const supervisionLevelEnum = pgEnum('supervision_level', [
  'direct',
  'indirect',
  'remote',
]);

export const trainingTermEnum = pgEnum('training_term', [
  'GPT1',
  'GPT2',
  'GPT3',
  'extended_skills',
  'other',
]);

export const workingArrangementEnum = pgEnum('working_arrangement', [
  'employee',
  'contractor',
  'partner',
  'locum',
]);

export const remunerationModelEnum = pgEnum('remuneration_model', [
  'percentage_of_billings',
  'salary',
  'sessional',
  'hybrid',
]);

// --- billing ----------------------------------------------------------------
export const billingPolicyEnum = pgEnum('billing_policy', [
  'bulk_bill_all',
  'mixed',
  'private',
]);

export const payerEnum = pgEnum('payer', [
  'medicare_bulk_bill',
  'medicare_patient_claim',
  'private',
  'dva',
  'workcover',
  'ctp',
  'third_party',
  'no_charge',
]);

export const feeScheduleKindEnum = pgEnum('fee_schedule_kind', [
  'bulk_bill',
  'private',
  'dva',
  'workcover',
  'non_medicare',
]);

export const billingCohortEnum = pgEnum('billing_cohort', [
  'commonwealth_concession_card',
  'pension_concession_card',
  'under_16',
  'over_65',
  'dva_card_holder',
  'aboriginal_or_torres_strait_islander',
  'mymedicare_registered',
]);

export const invoiceStatusEnum = pgEnum('invoice_status', [
  'draft',
  'issued',
  'part_paid',
  'paid',
  'written_off',
  'credited',
]);

export const claimStatusEnum = pgEnum('claim_status', [
  'draft',
  'submitted',
  'processing',
  'accepted',
  'rejected',
  'resubmitted',
  'part_paid',
  'paid',
]);

export const paymentMethodEnum = pgEnum('payment_method', [
  'eftpos',
  'card',
  'cash',
  'direct_deposit',
  'account',
]);

export const dvaCardColourEnum = pgEnum('dva_card_colour', ['gold', 'white', 'orange']);

// --- scheduling and clinical ------------------------------------------------
export const appointmentStatusEnum = pgEnum('appointment_status', [
  'booked',
  'confirmed',
  'arrived',
  'with_nurse',
  'waiting',
  'in_consultation',
  'completed',
  'cancelled',
  'did_not_attend',
]);

export const encounterTypeEnum = pgEnum('encounter_type', [
  'consultation',
  'telehealth_video',
  'telehealth_phone',
  'home_visit',
  'residential_aged_care',
  'nurse_clinic',
  'after_hours',
  'emergency',
]);

export const patientStatusEnum = pgEnum('patient_status', [
  'active',
  'inactive',
  'deceased',
  'transferred_out',
]);

export const atsiStatusEnum = pgEnum('atsi_status', [
  'aboriginal',
  'torres_strait_islander',
  'both',
  'neither',
  'not_stated',
]);

export const alertCategoryEnum = pgEnum('alert_category', ['clinical', 'front_desk']);

export const alertSeverityEnum = pgEnum('alert_severity', ['info', 'warning', 'critical']);

export const conditionStatusEnum = pgEnum('condition_status', [
  'active',
  'inactive',
  'resolved',
]);

export const recallPriorityEnum = pgEnum('recall_priority', [
  'routine',
  'urgent',
  'critical',
]);

export const recallStatusEnum = pgEnum('recall_status', [
  'open',
  'contacted',
  'attended',
  'closed_clinical_decision',
  'closed_patient_deceased',
]);

export const resultActionEnum = pgEnum('result_action', [
  'no_action_normal',
  'no_action_expected_abnormal',
  'inform_patient',
  'routine_recall',
  'urgent_recall',
  'immediate_contact',
  'refer',
]);

export const carePlanTypeEnum = pgEnum('care_plan_type', [
  'chronic_condition_management',
  'legacy_gpmp',
  'legacy_tca',
  'mental_health',
  'asthma_action',
  'other',
]);

export const consentTypeEnum = pgEnum('consent_type', [
  'privacy_collection_statement',
  'my_health_record_upload',
  'sms_communication',
  'email_communication',
  'mymedicare_registration',
  'procedure_specific',
  'third_party_disclosure',
  'research_or_qi_data_use',
]);

export const triageActionEnum = pgEnum('triage_action', [
  'call_000',
  'escalate_now',
  'same_day',
]);

export const taskStatusEnum = pgEnum('task_status', [
  'open',
  'in_progress',
  'completed',
  'cancelled',
]);

export const taskPriorityEnum = pgEnum('task_priority', [
  'low',
  'normal',
  'high',
  'urgent',
]);
