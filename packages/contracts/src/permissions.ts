/**
 * Granular permission catalogue.
 *
 * See spec/cross-cutting/authorization/permissions.md — permissions are stable
 * identifiers and roles bundle them. Only permissions with a shipped, enforced
 * capability are listed here; a permission that is not listed is denied to
 * every role. Extend this file (never a role-name check) when a slice adds
 * server-side enforcement for a new operation.
 */
import type { PracticeRole } from './roles';

export const PERMISSIONS = ['patient.search', 'sensitive_record.view'] as const;

export type Permission = (typeof PERMISSIONS)[number];

/**
 * All practice roles currently hold patient search because locating a patient
 * is a task for every authorised member of staff
 * (spec/capabilities/patient-search/spec.md — "all authorised practice staff
 * locate the correct patient"). Clinical content, billing and merge stay behind
 * their own permissions, added when those capabilities ship.
 *
 * `sensitive_record.view` is held only by the roles carrying primary clinical
 * responsibility for a patient. Authorisation requires this permission *plus* a
 * care/work relationship (spec/cross-cutting/authorization/permissions.md — "A
 * sensitive patient/entry can require `sensitive_record.view` plus a care/work
 * relationship"). No care-relationship check exists yet, so the permission on
 * its own is a practice-wide grant. Roles whose legitimate access would depend
 * on that missing check — nurse, allied health and every administrative role —
 * are therefore denied for now rather than over-granted, and a restricted
 * record reaches them as a stub. Widen this only with the relationship check.
 */
export const ROLE_PERMISSIONS: Record<PracticeRole, readonly Permission[]> = {
  practice_owner: ['patient.search', 'sensitive_record.view'],
  practice_manager: ['patient.search'],
  general_practitioner: ['patient.search', 'sensitive_record.view'],
  gp_registrar: ['patient.search', 'sensitive_record.view'],
  practice_nurse: ['patient.search'],
  allied_health: ['patient.search'],
  receptionist: ['patient.search'],
  practice_admin: ['patient.search'],
};

export function hasPermission(
  role: PracticeRole | null | undefined,
  permission: Permission,
): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
