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

export const PERMISSIONS = ['patient.search'] as const;

export type Permission = (typeof PERMISSIONS)[number];

/**
 * All practice roles currently hold patient search because locating a patient
 * is a task for every authorised member of staff
 * (spec/capabilities/patient-search/overview.md — "all authorised practice
 * staff locate the correct patient"). Clinical content, billing and merge
 * stay behind their own permissions, added when those capabilities ship.
 */
export const ROLE_PERMISSIONS: Record<PracticeRole, readonly Permission[]> = {
  practice_owner: ['patient.search'],
  practice_manager: ['patient.search'],
  general_practitioner: ['patient.search'],
  gp_registrar: ['patient.search'],
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
