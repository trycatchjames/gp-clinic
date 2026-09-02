/**
 * Default appointment types seeded during onboarding, reflecting how Australian
 * general practices actually run their books.
 * See spec/capabilities/practice-management/spec.md.
 */
import type { PractitionerKind } from './practitioner';

export interface AppointmentTypeSeed {
  name: string;
  shortCode: string;
  durationMinutes: number;
  colour: string;
  description: string;
  allowedPractitionerKinds: PractitionerKind[];
  onlineBookable: boolean;
  defaultMbsItem?: string;
  requiresTriagePrompt?: boolean;
}

export const APPOINTMENT_TYPE_SEED: AppointmentTypeSeed[] = [
  {
    name: 'Standard consultation',
    shortCode: 'STD',
    durationMinutes: 15,
    colour: '#2563eb',
    description: 'A single problem or a routine review.',
    allowedPractitionerKinds: ['gp', 'gp_registrar'],
    onlineBookable: true,
    defaultMbsItem: '23',
  },
  {
    name: 'Long consultation',
    shortCode: 'LONG',
    durationMinutes: 30,
    colour: '#7c3aed',
    description: 'More than one problem, or something that needs time.',
    allowedPractitionerKinds: ['gp', 'gp_registrar'],
    onlineBookable: true,
    defaultMbsItem: '36',
  },
  {
    name: 'Extended consultation',
    shortCode: 'EXT',
    durationMinutes: 45,
    colour: '#9333ea',
    description: 'Complex or multiple issues needing a prolonged consultation.',
    allowedPractitionerKinds: ['gp', 'gp_registrar'],
    onlineBookable: false,
    defaultMbsItem: '44',
  },
  {
    name: 'Brief consultation',
    shortCode: 'BRIEF',
    durationMinutes: 10,
    colour: '#0ea5e9',
    description: 'A script, a certificate or a simple result.',
    allowedPractitionerKinds: ['gp', 'gp_registrar'],
    onlineBookable: true,
    defaultMbsItem: '3',
  },
  {
    name: 'Telehealth — video',
    shortCode: 'THV',
    durationMinutes: 15,
    colour: '#0891b2',
    description: 'Video consultation.',
    allowedPractitionerKinds: ['gp', 'gp_registrar'],
    onlineBookable: true,
    defaultMbsItem: '91890',
  },
  {
    name: 'Telehealth — phone',
    shortCode: 'THP',
    durationMinutes: 15,
    colour: '#06b6d4',
    description: 'Phone consultation.',
    allowedPractitionerKinds: ['gp', 'gp_registrar'],
    onlineBookable: false,
    defaultMbsItem: '91801',
  },
  {
    name: 'Care plan (GPCCMP)',
    shortCode: 'CCM',
    durationMinutes: 45,
    colour: '#16a34a',
    description: 'Prepare a GP Chronic Condition Management Plan.',
    allowedPractitionerKinds: ['gp', 'gp_registrar'],
    onlineBookable: false,
    defaultMbsItem: '965',
  },
  {
    name: 'Care plan review',
    shortCode: 'CCMR',
    durationMinutes: 30,
    colour: '#22c55e',
    description: 'Review a GP Chronic Condition Management Plan.',
    allowedPractitionerKinds: ['gp', 'gp_registrar'],
    onlineBookable: false,
    defaultMbsItem: '967',
  },
  {
    name: 'Health assessment',
    shortCode: 'HA',
    durationMinutes: 45,
    colour: '#65a30d',
    description: 'Structured health assessment, including 75+ and item 715.',
    allowedPractitionerKinds: ['gp', 'gp_registrar', 'nurse', 'aboriginal_health_practitioner'],
    onlineBookable: false,
    defaultMbsItem: '705',
  },
  {
    name: 'Mental health treatment plan',
    shortCode: 'MHTP',
    durationMinutes: 45,
    colour: '#c026d3',
    description: 'Prepare or review a GP Mental Health Treatment Plan.',
    allowedPractitionerKinds: ['gp', 'gp_registrar'],
    onlineBookable: false,
    defaultMbsItem: '2701',
  },
  {
    name: 'Immunisation (nurse)',
    shortCode: 'IMM',
    durationMinutes: 10,
    colour: '#f59e0b',
    description: 'Vaccination with the practice nurse.',
    allowedPractitionerKinds: ['nurse', 'nurse_practitioner', 'aboriginal_health_practitioner'],
    onlineBookable: true,
  },
  {
    name: 'Treatment room (nurse)',
    shortCode: 'TRT',
    durationMinutes: 20,
    colour: '#f97316',
    description: 'Dressings, wound care, removal of sutures, ear syringing.',
    allowedPractitionerKinds: ['nurse', 'nurse_practitioner'],
    onlineBookable: true,
    defaultMbsItem: '10997',
  },
  {
    name: 'Procedure',
    shortCode: 'PROC',
    durationMinutes: 30,
    colour: '#dc2626',
    description: 'Excision, biopsy, implant or other minor procedure.',
    allowedPractitionerKinds: ['gp', 'gp_registrar'],
    onlineBookable: false,
    defaultMbsItem: '30071',
  },
  {
    name: 'Home visit',
    shortCode: 'HV',
    durationMinutes: 45,
    colour: '#78716c',
    description: 'Visit at the patient’s home.',
    allowedPractitionerKinds: ['gp', 'gp_registrar', 'nurse'],
    onlineBookable: false,
    defaultMbsItem: '24',
  },
  {
    name: 'Urgent same-day',
    shortCode: 'URG',
    durationMinutes: 15,
    colour: '#b91c1c',
    description: 'Same-day appointment for an acute problem.',
    allowedPractitionerKinds: ['gp', 'gp_registrar'],
    onlineBookable: false,
    requiresTriagePrompt: true,
    defaultMbsItem: '23',
  },
];
