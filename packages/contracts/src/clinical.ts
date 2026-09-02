/** Clinical domain constants. */

export const ENCOUNTER_TYPES = [
  'consultation',
  'telehealth_video',
  'telehealth_phone',
  'home_visit',
  'residential_aged_care',
  'nurse_clinic',
  'after_hours',
  'emergency',
] as const;
export type EncounterType = (typeof ENCOUNTER_TYPES)[number];

export const ENCOUNTER_TYPE_LABELS: Record<EncounterType, string> = {
  consultation: 'Consultation',
  telehealth_video: 'Telehealth — video',
  telehealth_phone: 'Telehealth — phone',
  home_visit: 'Home visit',
  residential_aged_care: 'Residential aged care',
  nurse_clinic: 'Nurse clinic',
  after_hours: 'After hours',
  emergency: 'In-practice emergency',
};

export const APPOINTMENT_STATUSES = [
  'booked',
  'confirmed',
  'arrived',
  'with_nurse',
  'waiting',
  'in_consultation',
  'completed',
  'cancelled',
  'did_not_attend',
] as const;
export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

/** Prototype appointment transitions. The product authority is spec/domain/appointment.md. */
export const APPOINTMENT_TRANSITIONS: Record<AppointmentStatus, readonly AppointmentStatus[]> = {
  booked: ['confirmed', 'arrived', 'cancelled', 'did_not_attend'],
  confirmed: ['arrived', 'cancelled', 'did_not_attend'],
  arrived: ['with_nurse', 'waiting', 'in_consultation', 'cancelled'],
  with_nurse: ['waiting', 'in_consultation'],
  waiting: ['in_consultation', 'cancelled'],
  in_consultation: ['completed'],
  completed: [],
  cancelled: [],
  did_not_attend: [],
};

/**
 * Murtagh's safe diagnostic strategy — the five questions taught in Australian
 * GP training. These prompts must not become autonomous diagnostic decisions; see
 * spec/cross-cutting/clinical-safety/principles.md.
 */
export const DIAGNOSTIC_SCAFFOLD_FIELDS = [
  { key: 'probability_diagnosis', label: 'What is the probability diagnosis?' },
  { key: 'serious_not_to_miss', label: 'What serious disorders must not be missed?' },
  { key: 'commonly_missed', label: 'What conditions are often missed?' },
  { key: 'masquerades_considered', label: 'Could this be a masquerade?' },
  { key: 'patient_agenda', label: 'Is the patient trying to tell me something else?' },
] as const;

/** The masquerades checklist. */
export const MASQUERADES = [
  'Depression',
  'Diabetes',
  'Drugs',
  'Anaemia',
  'Thyroid disease',
  'Spinal dysfunction',
  'Urinary tract infection',
] as const;

export const RECALL_PRIORITIES = ['routine', 'urgent', 'critical'] as const;
export type RecallPriority = (typeof RECALL_PRIORITIES)[number];

/**
 * A recall is a duty; a reminder is a prompt. They are never merged.
 * See spec/domain/result.md and spec/domain/recall.md.
 */
export const RESULT_ACTIONS = [
  'no_action_normal',
  'no_action_expected_abnormal',
  'inform_patient',
  'routine_recall',
  'urgent_recall',
  'immediate_contact',
  'refer',
] as const;
export type ResultAction = (typeof RESULT_ACTIONS)[number];

export const RESULT_ACTION_LABELS: Record<ResultAction, string> = {
  no_action_normal: 'Normal — no action',
  no_action_expected_abnormal: 'Abnormal but expected — no action',
  inform_patient: 'Inform the patient',
  routine_recall: 'Recall — routine',
  urgent_recall: 'Recall — urgent',
  immediate_contact: 'Contact immediately',
  refer: 'Refer',
};

export const ATSI_STATUSES = [
  'aboriginal',
  'torres_strait_islander',
  'both',
  'neither',
  'not_stated',
] as const;
export type AtsiStatus = (typeof ATSI_STATUSES)[number];

export const ATSI_STATUS_LABELS: Record<AtsiStatus, string> = {
  aboriginal: 'Aboriginal',
  torres_strait_islander: 'Torres Strait Islander',
  both: 'Both Aboriginal and Torres Strait Islander',
  neither: 'Neither',
  not_stated: 'Not stated',
};

export const CARE_PLAN_TYPES = [
  'chronic_condition_management',
  'legacy_gpmp',
  'legacy_tca',
  'mental_health',
  'asthma_action',
  'other',
] as const;
export type CarePlanType = (typeof CARE_PLAN_TYPES)[number];

/**
 * The GP Chronic Condition Management Plan replaced GPMP and TCA on 1 July 2025.
 * Legacy plans keep their allied health access until 1 July 2027.
 */
export const CHRONIC_CONDITION_FRAMEWORK = {
  newFrameworkFrom: '2025-07-01',
  legacyAlliedHealthAccessUntil: '2027-07-01',
  prepareItem: '965',
  reviewItem: '967',
  replacedItems: ['229', '721', '92024', '92055', '230', '723', '92025', '92056', '732'],
} as const;

export const CONSENT_TYPES = [
  'privacy_collection_statement',
  'my_health_record_upload',
  'sms_communication',
  'email_communication',
  'mymedicare_registration',
  'procedure_specific',
  'third_party_disclosure',
  'research_or_qi_data_use',
] as const;
export type ConsentType = (typeof CONSENT_TYPES)[number];
