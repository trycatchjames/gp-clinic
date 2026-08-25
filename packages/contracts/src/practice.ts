/** Practice, location and onboarding domain constants. */

export const ENTITY_TYPES = [
  'sole_trader',
  'company',
  'partnership',
  'trust',
  'aboriginal_community_controlled',
  'other',
] as const;
export type EntityType = (typeof ENTITY_TYPES)[number];

export const ENTITY_TYPE_LABELS: Record<EntityType, string> = {
  sole_trader: 'Sole trader',
  company: 'Company',
  partnership: 'Partnership',
  trust: 'Trust',
  aboriginal_community_controlled: 'Aboriginal Community Controlled Health Service',
  other: 'Other',
};

export const PRACTICE_TYPES = [
  'general_practice',
  'aboriginal_community_controlled_health_service',
  'after_hours_service',
  'corporate_group',
] as const;
export type PracticeType = (typeof PRACTICE_TYPES)[number];

export const PRACTICE_TYPE_LABELS: Record<PracticeType, string> = {
  general_practice: 'General practice',
  aboriginal_community_controlled_health_service:
    'Aboriginal Community Controlled Health Service',
  after_hours_service: 'After-hours service',
  corporate_group: 'Corporate group',
};

export const ONBOARDING_STATUSES = ['in_progress', 'active', 'suspended', 'closed'] as const;
export type OnboardingStatus = (typeof ONBOARDING_STATUSES)[number];

/** Steps of the onboarding wizard, in order. */
export const ONBOARDING_STEPS = [
  'practice_identity',
  'primary_location',
  'opening_hours',
  'registrations',
  'team',
  'appointment_types',
  'billing_setup',
  'review',
] as const;
export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

export const ONBOARDING_STEP_LABELS: Record<OnboardingStep, string> = {
  practice_identity: 'Practice identity',
  primary_location: 'Primary location',
  opening_hours: 'Opening hours',
  registrations: 'Registrations and identifiers',
  team: 'Team',
  appointment_types: 'Appointment types',
  billing_setup: 'Billing setup',
  review: 'Review and activate',
};

export const ONBOARDING_STEP_DESCRIPTIONS: Record<OnboardingStep, string> = {
  practice_identity: 'Legal entity, trading name, ABN and practice type.',
  primary_location: 'Where you see patients, and the timezone you work in.',
  opening_hours: 'When you are open, and what patients do when you are not.',
  registrations: 'HPI-O, Medicare Minor ID, MyMedicare, BBPIP and accreditation.',
  team: 'Practitioners, staff, provider numbers and supervision.',
  appointment_types: 'What can be booked, for how long, and what it usually bills as.',
  billing_setup: 'Billing policy and fee schedules for each payer.',
  review: 'Check what is outstanding and turn the practice on.',
};

/** RACGP GP1.3 — care outside normal opening hours. */
export const AFTER_HOURS_ARRANGEMENTS = [
  'own_practitioners',
  'cooperative',
  'deputising_service',
  'hospital_ed_referral',
] as const;
export type AfterHoursArrangement = (typeof AFTER_HOURS_ARRANGEMENTS)[number];

export const AFTER_HOURS_ARRANGEMENT_LABELS: Record<AfterHoursArrangement, string> = {
  own_practitioners: 'Our own practitioners',
  cooperative: 'A cooperative with other practices',
  deputising_service: 'A medical deputising service',
  hospital_ed_referral: 'Refer patients to a hospital emergency department',
};

export const AUSTRALIAN_STATES = ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'] as const;
export type AustralianState = (typeof AUSTRALIAN_STATES)[number];

export const AUSTRALIAN_TIMEZONES = [
  'Australia/Sydney',
  'Australia/Melbourne',
  'Australia/Brisbane',
  'Australia/Adelaide',
  'Australia/Perth',
  'Australia/Hobart',
  'Australia/Darwin',
  'Australia/Broken_Hill',
  'Australia/Lord_Howe',
  'Australia/Eucla',
] as const;
export type AustralianTimezone = (typeof AUSTRALIAN_TIMEZONES)[number];

/** Default timezone per state. Offered as a default, never forced — Broken Hill exists. */
export const DEFAULT_TIMEZONE_BY_STATE: Record<AustralianState, AustralianTimezone> = {
  NSW: 'Australia/Sydney',
  VIC: 'Australia/Melbourne',
  QLD: 'Australia/Brisbane',
  SA: 'Australia/Adelaide',
  WA: 'Australia/Perth',
  TAS: 'Australia/Hobart',
  NT: 'Australia/Darwin',
  ACT: 'Australia/Sydney',
};

/**
 * Real-time prescription monitoring system by jurisdiction.
 * Checking is mandatory in VIC and QLD; voluntary elsewhere.
 * See docs/40-clinical/03-prescribing.md.
 */
export const RTPM_BY_STATE: Record<AustralianState, { name: string; mandatory: boolean }> = {
  VIC: { name: 'SafeScript', mandatory: true },
  QLD: { name: 'QScript', mandatory: true },
  NSW: { name: 'SafeScript NSW', mandatory: false },
  SA: { name: 'ScriptCheckSA', mandatory: false },
  WA: { name: 'ScriptCheckWA', mandatory: false },
  TAS: { name: 'TasScript', mandatory: false },
  NT: { name: 'NTScript', mandatory: false },
  ACT: { name: 'Canberra Script', mandatory: false },
};

export const DAYS_OF_WEEK = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;
export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];
