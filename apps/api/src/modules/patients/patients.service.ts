import { Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { DATABASE } from '../../db/database.module';
import type { Database } from '../../db/client';
import { patientAlerts, patientEntitlements, patients } from '../../db/schema';
import { AuditService } from '../../common/audit.service';
import { matchPatient, rankMatches, type PatientCandidate } from './patient-matching';
import type { PatientSearchResponseDto, PatientSearchResultDto } from './patients.dto';

/** Above this, the receptionist is asked to refine rather than scroll a long list. */
const MAX_RESULTS = 20;

@Injectable()
export class PatientsService {
  constructor(
    @Inject(DATABASE) private readonly db: Database,
    private readonly audit: AuditService,
  ) {}

  /**
   * @param canViewSensitive whether the caller holds `sensitive_record.view`. A
   *   caller without it still finds a restricted record — otherwise the search
   *   meant to prevent a duplicate would cause one — but reads it only as a
   *   stub. The decision is made here, at the domain boundary, not in the DTO
   *   or the screen.
   */
  async search(
    practiceId: string,
    actorUserId: string | null,
    query: { q?: string; dateOfBirth?: string },
    canViewSensitive = false,
  ): Promise<PatientSearchResponseDto> {
    const q = query.q?.trim() || undefined;
    const dateOfBirth = query.dateOfBirth?.trim() || undefined;

    if (!q && !dateOfBirth) {
      return { results: [], totalMatches: 0, truncated: false, restrictedMatches: 0 };
    }

    const rows = await this.db
      .select({ patient: patients, entitlement: patientEntitlements, restriction: patientAlerts })
      .from(patients)
      .leftJoin(patientEntitlements, eq(patientEntitlements.patientId, patients.id))
      .leftJoin(
        patientAlerts,
        and(
          eq(patientAlerts.patientId, patients.id),
          eq(patientAlerts.category, 'access_restriction'),
          eq(patientAlerts.isActive, true),
        ),
      )
      .where(eq(patients.practiceId, practiceId));

    // A patient can carry more than one active restriction, and the joins are
    // one-to-many, so collapse back to one candidate per patient before
    // matching. Without this a restricted record is offered twice, which is the
    // duplicate the search exists to prevent.
    const byPatientId = new Map<string, PatientCandidate>();
    for (const { patient, entitlement, restriction } of rows) {
      const existing = byPatientId.get(patient.id);
      if (existing) {
        existing.accessRestricted ||= restriction !== null;
        existing.medicareNumber ??= entitlement?.medicareNumber ?? null;
        existing.medicareIrn ??= entitlement?.medicareIrn ?? null;
        continue;
      }
      byPatientId.set(patient.id, {
        id: patient.id,
        familyName: patient.familyName,
        givenNames: patient.givenNames,
        preferredName: patient.preferredName,
        dateOfBirth: patient.dateOfBirth,
        residentialAddress: patient.residentialAddress,
        suburb: patient.suburb,
        postcode: patient.postcode,
        mobile: patient.mobile,
        homePhone: patient.homePhone,
        workPhone: patient.workPhone,
        status: patient.status,
        localRecordNumber: patient.localRecordNumber,
        medicareNumber: entitlement?.medicareNumber ?? null,
        medicareIrn: entitlement?.medicareIrn ?? null,
        accessRestricted: restriction !== null,
      });
    }
    const candidates: PatientCandidate[] = [...byPatientId.values()];

    const matches = candidates
      .map((candidate) => matchPatient(candidate, { q, dateOfBirth }))
      .filter((match): match is NonNullable<typeof match> => match !== null);

    const ranked = rankMatches(matches);
    const page = ranked.slice(0, MAX_RESULTS);
    const redactedIds = page
      .filter((match) => match.candidate.accessRestricted && !canViewSensitive)
      .map((match) => match.candidate.id);

    // Proportionate logging: which kinds of identifier were searched, not the
    // values themselves. See spec/capabilities/patient-search/permissions.md.
    await this.audit.record({
      practiceId,
      actorUserId,
      action: 'patient.search.performed',
      entityType: 'Patient',
      context: {
        identifierTypes: identifierTypesUsed(q, dateOfBirth),
        resultCount: ranked.length,
      },
    });

    // Authorisation requires that a sensitive attempt is auditable in its own
    // right (spec/cross-cutting/authorization/permissions.md — "Denial reveals
    // no unnecessary patient existence/content and creates an audit event for
    // sensitive attempts"). One entry per restricted record reached, so the
    // privacy officer can see which record was approached and by whom.
    for (const patientId of redactedIds) {
      await this.audit.record({
        practiceId,
        actorUserId,
        patientId,
        action: 'patient.search.restricted_stub_returned',
        entityType: 'Patient',
        entityId: patientId,
        context: { identifierTypes: identifierTypesUsed(q, dateOfBirth) },
      });
    }

    const redacted = new Set(redactedIds);

    return {
      results: page.map((match) => toResultDto(match, redacted.has(match.candidate.id))),
      totalMatches: ranked.length,
      truncated: ranked.length > page.length,
      restrictedMatches: redactedIds.length,
    };
  }
}

function identifierTypesUsed(q?: string, dateOfBirth?: string): string[] {
  const types: string[] = [];
  if (dateOfBirth) types.push('dateOfBirth');
  if (q) types.push(/\d/.test(q) ? 'identifierNumber' : 'name');
  return types;
}

/**
 * @param redact build the restricted identity stub instead of the ordinary
 *   result. The stub keeps only what prevents a duplicate or a wrong-patient
 *   action — the identity the domain requires of it
 *   (spec/cross-cutting/authorization/permissions.md — "search may show a
 *   restricted stub with identifiers and access request path") — and drops
 *   every contact, address and entitlement fact. It is built by naming the
 *   fields that survive rather than by deleting fields from a full result, so a
 *   field added later is withheld until someone decides otherwise.
 */
function toResultDto(
  match: ReturnType<typeof rankMatches>[number],
  redact: boolean,
): PatientSearchResultDto {
  const { candidate } = match;
  const nameUsed = `${candidate.preferredName ?? candidate.givenNames} ${candidate.familyName}`;

  if (redact) {
    return {
      id: candidate.id,
      nameUsed,
      legalName: null,
      dateOfBirth: candidate.dateOfBirth,
      suburb: null,
      postcode: null,
      maskedContact: null,
      maskedMedicareNumber: null,
      medicareIrn: null,
      localRecordNumber: candidate.localRecordNumber,
      status: candidate.status,
      similarMatch: match.similarMatch,
      matchedFields: match.matchedFields,
      restricted: true,
    };
  }

  const legalName = candidate.preferredName
    ? `${candidate.givenNames} ${candidate.familyName}`
    : null;

  const contact = candidate.mobile ?? candidate.homePhone ?? candidate.workPhone;

  return {
    id: candidate.id,
    nameUsed,
    legalName,
    dateOfBirth: candidate.dateOfBirth,
    suburb: candidate.suburb,
    postcode: candidate.postcode,
    maskedContact: contact ? maskTail(contact, 3) : null,
    maskedMedicareNumber: candidate.medicareNumber ? maskTail(candidate.medicareNumber, 2) : null,
    medicareIrn: candidate.medicareIrn,
    localRecordNumber: candidate.localRecordNumber,
    status: candidate.status,
    similarMatch: match.similarMatch,
    matchedFields: match.matchedFields,
    restricted: false,
  };
}

/** Masks every digit except the last `visible`, keeping any existing spacing. */
function maskTail(raw: string, visible: number): string {
  const digitCount = (raw.match(/\d/g) ?? []).length;
  let seen = 0;
  return raw.replace(/\d/g, (digit) => {
    seen += 1;
    return seen > digitCount - visible ? digit : '•';
  });
}
