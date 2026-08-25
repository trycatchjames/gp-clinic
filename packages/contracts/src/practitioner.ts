/** Practitioner kinds, credentials and supervision. */

export const PRACTITIONER_KINDS = [
  'gp',
  'gp_registrar',
  'nurse',
  'nurse_practitioner',
  'midwife',
  'allied_health',
  'practice_pharmacist',
  'aboriginal_health_practitioner',
] as const;
export type PractitionerKind = (typeof PRACTITIONER_KINDS)[number];

export const PRACTITIONER_KIND_LABELS: Record<PractitionerKind, string> = {
  gp: 'General Practitioner',
  gp_registrar: 'GP Registrar',
  nurse: 'Practice Nurse',
  nurse_practitioner: 'Nurse Practitioner',
  midwife: 'Midwife',
  allied_health: 'Allied Health',
  practice_pharmacist: 'Practice Pharmacist',
  aboriginal_health_practitioner: 'Aboriginal Health Practitioner',
};

/** Practitioner kinds that can hold a Medicare provider number and bill attendances. */
export const BILLABLE_PRACTITIONER_KINDS: readonly PractitionerKind[] = [
  'gp',
  'gp_registrar',
  'nurse_practitioner',
];

export const AHPRA_REGISTRATION_TYPES = [
  'general',
  'specialist',
  'limited',
  'provisional',
  'non_practising',
] as const;
export type AhpraRegistrationType = (typeof AHPRA_REGISTRATION_TYPES)[number];

export const QUALIFICATION_TYPES = [
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
] as const;
export type QualificationType = (typeof QUALIFICATION_TYPES)[number];

export const QUALIFICATION_LABELS: Record<QualificationType, string> = {
  fellowship_racgp: 'FRACGP',
  fellowship_acrrm: 'FACRRM',
  mental_health_skills_training: 'Mental Health Skills Training (GPMHSC)',
  focussed_psychological_strategies: 'Focussed Psychological Strategies',
  cpr: 'CPR',
  anaphylaxis: 'Anaphylaxis management',
  immunisation_provider: 'Immunisation provider accreditation',
  cervical_screening: 'Cervical screening',
  iud_insertion: 'IUD insertion',
  implant_insertion: 'Contraceptive implant insertion',
  skin_procedures: 'Skin procedures',
  spirometry: 'Spirometry',
  other: 'Other',
};

export const SUPERVISION_LEVELS = ['direct', 'indirect', 'remote'] as const;
export type SupervisionLevel = (typeof SUPERVISION_LEVELS)[number];

export const SUPERVISION_LEVEL_LABELS: Record<SupervisionLevel, string> = {
  direct: 'Direct — supervisor on site and immediately available',
  indirect: 'Indirect — supervisor on site or contactable',
  remote: 'Remote — supervisor contactable by phone',
};

/** Supervision levels that require a supervisor rostered at the same location. */
export const ON_SITE_SUPERVISION_LEVELS: readonly SupervisionLevel[] = ['direct', 'indirect'];

export const TRAINING_TERMS = ['GPT1', 'GPT2', 'GPT3', 'extended_skills', 'other'] as const;
export type TrainingTerm = (typeof TRAINING_TERMS)[number];

export const REMUNERATION_MODELS = [
  'percentage_of_billings',
  'salary',
  'sessional',
  'hybrid',
] as const;
export type RemunerationModel = (typeof REMUNERATION_MODELS)[number];

export const REMUNERATION_MODEL_LABELS: Record<RemunerationModel, string> = {
  percentage_of_billings: 'Percentage of billings',
  salary: 'Salary',
  sessional: 'Sessional rate',
  hybrid: 'Base plus percentage',
};
