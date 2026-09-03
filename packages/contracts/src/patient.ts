/** Patient lifecycle status. See spec/domain/patient/invariants.md. */
export const PATIENT_STATUSES = ['active', 'inactive', 'deceased', 'transferred_out'] as const;

export type PatientStatus = (typeof PATIENT_STATUSES)[number];

export const PATIENT_STATUS_LABELS: Record<PatientStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  deceased: 'Deceased',
  transferred_out: 'Transferred out',
};

/**
 * Search result fields a candidate matched on, in plain language so the screen
 * can "explain which safe fields matched" without exposing raw query terms.
 * See spec/cross-cutting/search/requirements.md.
 */
export const PATIENT_MATCH_FIELDS = [
  'name',
  'date of birth',
  'phone number',
  'address',
  'Medicare card number',
  'local record number',
] as const;

export type PatientMatchField = (typeof PATIENT_MATCH_FIELDS)[number];
