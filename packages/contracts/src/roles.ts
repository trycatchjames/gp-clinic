/**
 * Roles and permissions.
 *
 * Australian general practice mixes clinical and small-business roles in one
 * building. See spec/product/roles.md and spec/cross-cutting/authorization/permissions.md.
 */

export const PRACTICE_ROLES = [
  'practice_owner',
  'practice_manager',
  'general_practitioner',
  'gp_registrar',
  'practice_nurse',
  'allied_health',
  'receptionist',
  'practice_admin',
] as const;

export type PracticeRole = (typeof PRACTICE_ROLES)[number];

export const ROLE_LABELS: Record<PracticeRole, string> = {
  practice_owner: 'Practice Owner',
  practice_manager: 'Practice Manager',
  general_practitioner: 'General Practitioner',
  gp_registrar: 'GP Registrar',
  practice_nurse: 'Practice Nurse',
  allied_health: 'Allied Health',
  receptionist: 'Receptionist',
  practice_admin: 'Practice Admin',
};

/** Roles that may open a clinical record. Reception deliberately cannot. */
export const CLINICAL_ROLES: readonly PracticeRole[] = [
  'practice_owner',
  'general_practitioner',
  'gp_registrar',
  'practice_nurse',
  'allied_health',
];

/** Roles that may administer the practice itself. */
export const ADMIN_ROLES: readonly PracticeRole[] = [
  'practice_owner',
  'practice_manager',
];

export const ROLE_DESCRIPTIONS: Record<PracticeRole, string> = {
  practice_owner: 'Full clinical and business access, including practice settings and users.',
  practice_manager: 'Full business access. Clinical access limited to billing-relevant metadata.',
  general_practitioner: 'Full clinical access. Manages their own profile and availability.',
  gp_registrar: 'Full clinical access with supervision markers and escalation.',
  practice_nurse: 'Full clinical access with restricted prescribing.',
  allied_health: 'Access to their own encounters and the shared health summary.',
  receptionist: 'Demographics, appointments and billing only. No clinical notes.',
  practice_admin: 'Non-clinical administration and reporting.',
};
