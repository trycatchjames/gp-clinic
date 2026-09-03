import { describe, expect, it } from 'vitest';
import { matchPatient, rankMatches, type PatientCandidate } from './patient-matching';

function candidate(overrides: Partial<PatientCandidate> = {}): PatientCandidate {
  return {
    id: 'p1',
    familyName: 'Doyle',
    givenNames: 'Margaret Anne',
    preferredName: null,
    dateOfBirth: '1952-03-14',
    residentialAddress: '18 Albert Street',
    suburb: 'Brunswick',
    postcode: '3056',
    mobile: '0412 555 001',
    homePhone: null,
    workPhone: null,
    status: 'active',
    localRecordNumber: 'R000001',
    medicareNumber: null,
    medicareIrn: null,
    ...overrides,
  };
}

const twinIsla = candidate({
  id: 'twin-1',
  familyName: 'Ngo',
  givenNames: 'Isla',
  dateOfBirth: '2015-04-02',
  suburb: 'Coburg',
  mobile: '0412 555 004',
  medicareNumber: '3261125853',
  medicareIrn: '1',
});

const twinMia = candidate({
  id: 'twin-2',
  familyName: 'Ngo',
  givenNames: 'Mia',
  dateOfBirth: '2015-04-02',
  suburb: 'Coburg',
  mobile: '0412 555 005',
  medicareNumber: '3261125853',
  medicareIrn: '2',
});

describe('matchPatient', () => {
  it('returns null when neither a query nor a date of birth is supplied', () => {
    expect(matchPatient(candidate(), {})).toBeNull();
  });

  it('matches an accented, hyphenated or apostrophised name against a plain query', () => {
    const patient = candidate({ familyName: "O'Brien-Núñez", givenNames: 'José' });
    expect(matchPatient(patient, { q: 'obrien nunez' })?.matchedFields).toContain('name');
    expect(matchPatient(patient, { q: 'jose' })?.matchedFields).toContain('name');
  });

  it('does not match an unrelated name', () => {
    expect(matchPatient(candidate(), { q: 'Nguyen' })).toBeNull();
  });

  it('matches the address, suburb or postcode used by reception to distinguish a patient', () => {
    expect(matchPatient(candidate(), { q: 'Albert Street' })?.matchedFields).toContain('address');
    expect(matchPatient(candidate(), { q: 'Brunswick' })?.matchedFields).toContain('address');
    expect(matchPatient(candidate(), { q: '3056' })?.matchedFields).toContain('address');
  });

  it('ranks an exact name match ahead of a partial one', () => {
    const exact = matchPatient(candidate(), { q: 'Doyle' });
    const partial = matchPatient(candidate(), { q: 'Doy' });
    expect(exact?.rank).toBe(0);
    expect(partial?.rank).toBe(1);
  });

  it('requires a short digit query to still resolve to a real phone number', () => {
    // A two-digit fragment must not fan out and match every phone on file.
    expect(matchPatient(candidate(), { q: '01' })).toBeNull();
  });

  it('matches on Medicare card number and records which field matched', () => {
    const match = matchPatient(twinIsla, { q: '3261125853' });
    expect(match?.matchedFields).toEqual(['Medicare card number']);
  });

  it('requires every supplied identifier to match — name AND date of birth', () => {
    expect(matchPatient(twinIsla, { q: 'Ngo', dateOfBirth: '1999-01-01' })).toBeNull();
    expect(matchPatient(twinIsla, { q: 'Ngo', dateOfBirth: '2015-04-02' })?.matchedFields).toEqual(
      expect.arrayContaining(['name', 'date of birth']),
    );
  });

  it('never auto-resolves: two patients sharing a Medicare card both match, separately', () => {
    const matches = [twinIsla, twinMia]
      .map((patient) => matchPatient(patient, { q: '3261125853' }))
      .filter((m): m is NonNullable<typeof m> => m !== null);

    expect(matches).toHaveLength(2);
    expect(matches.map((m) => m.candidate.id)).toEqual(['twin-1', 'twin-2']);
  });
});

describe('rankMatches', () => {
  it('flags same-family-name, same-date-of-birth candidates as similar without picking one', () => {
    const matches = [twinIsla, twinMia]
      .map((patient) => matchPatient(patient, { q: 'Ngo', dateOfBirth: '2015-04-02' }))
      .filter((m): m is NonNullable<typeof m> => m !== null);

    const ranked = rankMatches(matches);
    expect(ranked).toHaveLength(2);
    expect(ranked.every((m) => m.similarMatch)).toBe(true);
  });

  it('does not flag a lone match as similar', () => {
    const matches = [candidate()]
      .map((patient) => matchPatient(patient, { q: 'Doyle' }))
      .filter((m): m is NonNullable<typeof m> => m !== null);

    expect(rankMatches(matches)[0].similarMatch).toBe(false);
  });
});
