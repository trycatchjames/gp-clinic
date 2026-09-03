import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DATABASE } from '../../db/database.module';
import type { Database } from '../../db/client';
import { patientEntitlements, patients } from '../../db/schema';
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

  async search(
    practiceId: string,
    actorUserId: string | null,
    query: { q?: string; dateOfBirth?: string },
  ): Promise<PatientSearchResponseDto> {
    const q = query.q?.trim() || undefined;
    const dateOfBirth = query.dateOfBirth?.trim() || undefined;

    if (!q && !dateOfBirth) {
      return { results: [], totalMatches: 0, truncated: false };
    }

    const rows = await this.db
      .select({ patient: patients, entitlement: patientEntitlements })
      .from(patients)
      .leftJoin(patientEntitlements, eq(patientEntitlements.patientId, patients.id))
      .where(eq(patients.practiceId, practiceId));

    const candidates: PatientCandidate[] = rows.map(({ patient, entitlement }) => ({
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
    }));

    const matches = candidates
      .map((candidate) => matchPatient(candidate, { q, dateOfBirth }))
      .filter((match): match is NonNullable<typeof match> => match !== null);

    const ranked = rankMatches(matches);
    const page = ranked.slice(0, MAX_RESULTS);

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

    return {
      results: page.map(toResultDto),
      totalMatches: ranked.length,
      truncated: ranked.length > page.length,
    };
  }
}

function identifierTypesUsed(q?: string, dateOfBirth?: string): string[] {
  const types: string[] = [];
  if (dateOfBirth) types.push('dateOfBirth');
  if (q) types.push(/\d/.test(q) ? 'identifierNumber' : 'name');
  return types;
}

function toResultDto(
  match: ReturnType<typeof rankMatches>[number],
): PatientSearchResultDto {
  const { candidate } = match;
  const nameUsed = `${candidate.preferredName ?? candidate.givenNames} ${candidate.familyName}`;
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
