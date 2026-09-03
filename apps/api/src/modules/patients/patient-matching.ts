import type { PatientMatchField } from '@gp/contracts';

/**
 * The columns a candidate is matched against. A plain projection rather than the
 * Drizzle row type, so the matching rules stay unit-testable without a database.
 */
export interface PatientCandidate {
  id: string;
  familyName: string;
  givenNames: string;
  preferredName: string | null;
  dateOfBirth: string;
  residentialAddress: string | null;
  suburb: string | null;
  postcode: string | null;
  mobile: string | null;
  homePhone: string | null;
  workPhone: string | null;
  status: string;
  localRecordNumber: string;
  medicareNumber: string | null;
  medicareIrn: string | null;
}

export interface PatientSearchQuery {
  /** Free text: name, address, phone, Medicare card number or local record number. */
  q?: string;
  /** Exact date of birth, ISO (YYYY-MM-DD). */
  dateOfBirth?: string;
}

export interface PatientMatch {
  candidate: PatientCandidate;
  /** 0 = exact match on some field, 1 = partial/substring match. Sorted ascending. */
  rank: 0 | 1;
  matchedFields: PatientMatchField[];
}

/**
 * Strips diacritics and apostrophes, and turns a hyphen into a space, so
 * "O'Brien-Núñez" matches "obrien nunez" or "OBrien Nunez" alike.
 */
function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’]/g, '')
    .replace(/-/g, ' ')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeDigits(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Matches one candidate against a query. Returns null when the candidate does
 * not match every supplied identifier — a search never decides identity from a
 * score, but it also never treats an unrelated record as a match on rank alone.
 */
export function matchPatient(
  candidate: PatientCandidate,
  query: PatientSearchQuery,
): PatientMatch | null {
  const q = query.q?.trim() ?? '';
  const dateOfBirth = query.dateOfBirth?.trim() ?? '';
  if (!q && !dateOfBirth) return null;

  const matchedFields = new Set<PatientMatchField>();
  // 0 = exact match on some field, 1 = partial/substring only. Lower always wins.
  let rank: 0 | 1 = 1;
  const recordExact = (fieldRank: 0 | 1) => {
    rank = Math.min(rank, fieldRank) as 0 | 1;
  };

  if (dateOfBirth) {
    if (candidate.dateOfBirth !== dateOfBirth) return null;
    matchedFields.add('date of birth');
    recordExact(0);
  }

  if (q) {
    const textQuery = normalizeText(q);
    const digitsQuery = normalizeDigits(q);
    let matchedOnQuery = false;

    if (textQuery) {
      const fullName = normalizeText(`${candidate.givenNames} ${candidate.familyName}`);
      const familyOnly = normalizeText(candidate.familyName);
      const givenOnly = normalizeText(candidate.givenNames);
      const preferredOnly = candidate.preferredName ? normalizeText(candidate.preferredName) : '';

      if (fullName === textQuery || familyOnly === textQuery || givenOnly === textQuery || preferredOnly === textQuery) {
        matchedFields.add('name');
        recordExact(0);
        matchedOnQuery = true;
      } else if (
        fullName.includes(textQuery) ||
        familyOnly.includes(textQuery) ||
        givenOnly.includes(textQuery) ||
        (preferredOnly && preferredOnly.includes(textQuery))
      ) {
        matchedFields.add('name');
        matchedOnQuery = true;
      }

      const addressValues = [
        candidate.residentialAddress,
        candidate.suburb,
        candidate.postcode,
        [candidate.residentialAddress, candidate.suburb, candidate.postcode]
          .filter(Boolean)
          .join(' '),
      ].filter((value): value is string => Boolean(value)).map(normalizeText);
      const canMatchAddress = (/^[0-9]{4}$/.test(textQuery) || /[a-z]/.test(textQuery)) && textQuery.length >= 3;
      if (canMatchAddress && addressValues.some((value) => value === textQuery)) {
        matchedFields.add('address');
        recordExact(0);
        matchedOnQuery = true;
      } else if (canMatchAddress && addressValues.some((value) => value.includes(textQuery))) {
        matchedFields.add('address');
        matchedOnQuery = true;
      }
    }

    // Digit identifiers only apply once the query carries enough digits to mean
    // something — a two-digit street number should not match every phone on file.
    if (digitsQuery.length >= 6) {
      const phones = [candidate.mobile, candidate.homePhone, candidate.workPhone]
        .filter((value): value is string => Boolean(value))
        .map(normalizeDigits);
      if (phones.includes(digitsQuery)) {
        matchedFields.add('phone number');
        recordExact(0);
        matchedOnQuery = true;
      } else if (phones.some((phone) => phone.includes(digitsQuery))) {
        matchedFields.add('phone number');
        matchedOnQuery = true;
      }

      const medicare = candidate.medicareNumber ? normalizeDigits(candidate.medicareNumber) : '';
      if (medicare) {
        if (medicare === digitsQuery) {
          matchedFields.add('Medicare card number');
          recordExact(0);
          matchedOnQuery = true;
        } else if (medicare.includes(digitsQuery)) {
          matchedFields.add('Medicare card number');
          matchedOnQuery = true;
        }
      }
    }

    const recordQuery = q.replace(/\s+/g, '').toLowerCase();
    const recordValue = candidate.localRecordNumber.toLowerCase();
    if (recordQuery.length >= 3) {
      if (recordValue === recordQuery) {
        matchedFields.add('local record number');
        recordExact(0);
        matchedOnQuery = true;
      } else if (recordValue.includes(recordQuery)) {
        matchedFields.add('local record number');
        matchedOnQuery = true;
      }
    }

    if (!matchedOnQuery) return null;
  }

  return { candidate, rank, matchedFields: [...matchedFields] };
}

/**
 * Flags candidates that share a family name and date of birth with another
 * result — the explicit "similar record" indicator search must never resolve
 * on its own. See spec/cross-cutting/search/requirements.md.
 */
export function markSimilarMatches(
  matches: readonly PatientMatch[],
): (PatientMatch & { similarMatch: boolean })[] {
  const groupKey = (candidate: PatientCandidate) =>
    `${normalizeText(candidate.familyName)}|${candidate.dateOfBirth}`;

  const counts = new Map<string, number>();
  for (const match of matches) {
    const key = groupKey(match.candidate);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return matches.map((match) => ({
    ...match,
    similarMatch: (counts.get(groupKey(match.candidate)) ?? 0) > 1,
  }));
}

export function rankMatches(
  matches: readonly PatientMatch[],
): (PatientMatch & { similarMatch: boolean })[] {
  return markSimilarMatches(matches).sort(
    (a, b) => a.rank - b.rank || a.candidate.familyName.localeCompare(b.candidate.familyName),
  );
}
