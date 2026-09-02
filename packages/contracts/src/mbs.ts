/**
 * A working subset of the Medicare Benefits Schedule, sufficient to demonstrate
 * the billing workflows. Fees are indicative only — the authoritative source is
 * mbsonline.gov.au and the schedule is reindexed at least annually.
 *
 * See spec/research/sources.md. This time-sensitive subset must be reverified before use.
 */

export interface MbsItemSeed {
  itemNumber: string;
  description: string;
  category: string;
  group: string;
  scheduleFeeCents: number;
  benefitPercent: number;
  /** Minimum duration in minutes for a time-tiered item. */
  minMinutes?: number;
  /** Maximum duration in minutes, exclusive, for a time-tiered item. */
  maxMinutes?: number;
  requiresMentalHealthSkillsTraining?: boolean;
  requiresMyMedicare?: boolean;
  bulkBillIncentiveEligible?: boolean;
  /** Minimum months between claims for the same patient. */
  frequencyLimitMonths?: number;
  effectiveFrom: string;
  effectiveTo?: string;
  notes?: string;
}

export const MBS_ITEM_SEED: MbsItemSeed[] = [
  // --- GP attendances, consulting rooms -----------------------------------
  {
    itemNumber: '3',
    description: 'Level A — brief consultation',
    category: 'Professional attendances',
    group: 'A1 General practitioner attendances',
    scheduleFeeCents: 2055,
    benefitPercent: 100,
    maxMinutes: 6,
    bulkBillIncentiveEligible: true,
    effectiveFrom: '2026-08-01',
  },
  {
    itemNumber: '23',
    description: 'Level B — standard consultation, less than 20 minutes',
    category: 'Professional attendances',
    group: 'A1 General practitioner attendances',
    scheduleFeeCents: 4505,
    benefitPercent: 100,
    minMinutes: 6,
    maxMinutes: 20,
    bulkBillIncentiveEligible: true,
    effectiveFrom: '2026-08-01',
  },
  {
    itemNumber: '36',
    description: 'Level C — long consultation, at least 20 and less than 40 minutes',
    category: 'Professional attendances',
    group: 'A1 General practitioner attendances',
    scheduleFeeCents: 8710,
    benefitPercent: 100,
    minMinutes: 20,
    maxMinutes: 40,
    bulkBillIncentiveEligible: true,
    effectiveFrom: '2026-08-01',
  },
  {
    itemNumber: '44',
    description: 'Level D — prolonged consultation, at least 40 minutes',
    category: 'Professional attendances',
    group: 'A1 General practitioner attendances',
    scheduleFeeCents: 12835,
    benefitPercent: 100,
    minMinutes: 40,
    bulkBillIncentiveEligible: true,
    effectiveFrom: '2026-08-01',
  },

  // --- Telehealth ---------------------------------------------------------
  {
    itemNumber: '91890',
    description: 'Level B — video telehealth consultation, less than 20 minutes',
    category: 'Professional attendances',
    group: 'Telehealth attendances',
    scheduleFeeCents: 4505,
    benefitPercent: 100,
    minMinutes: 6,
    maxMinutes: 20,
    bulkBillIncentiveEligible: true,
    effectiveFrom: '2026-08-01',
    notes: 'Eligibility generally requires an existing relationship or MyMedicare registration.',
  },
  {
    itemNumber: '91891',
    description: 'Level C — video telehealth consultation, at least 20 and less than 40 minutes',
    category: 'Professional attendances',
    group: 'Telehealth attendances',
    scheduleFeeCents: 8710,
    benefitPercent: 100,
    minMinutes: 20,
    maxMinutes: 40,
    bulkBillIncentiveEligible: true,
    effectiveFrom: '2026-08-01',
  },
  {
    itemNumber: '91801',
    description: 'Level B — phone telehealth consultation, less than 20 minutes',
    category: 'Professional attendances',
    group: 'Telehealth attendances',
    scheduleFeeCents: 4505,
    benefitPercent: 100,
    maxMinutes: 20,
    bulkBillIncentiveEligible: true,
    effectiveFrom: '2026-08-01',
  },

  // --- Chronic condition management (from 1 July 2025) ---------------------
  {
    itemNumber: '965',
    description: 'Prepare a GP Chronic Condition Management Plan',
    category: 'Professional attendances',
    group: 'Chronic condition management',
    scheduleFeeCents: 15655,
    benefitPercent: 100,
    minMinutes: 20,
    requiresMyMedicare: false,
    frequencyLimitMonths: 12,
    effectiveFrom: '2025-07-01',
    notes:
      'Replaced GP Management Plan (721) and Team Care Arrangements (723). Linked to MyMedicare registration where the patient is registered.',
  },
  {
    itemNumber: '967',
    description: 'Review a GP Chronic Condition Management Plan',
    category: 'Professional attendances',
    group: 'Chronic condition management',
    scheduleFeeCents: 15655,
    benefitPercent: 100,
    frequencyLimitMonths: 3,
    effectiveFrom: '2025-07-01',
    notes: 'Replaced item 732.',
  },

  // --- Health assessments --------------------------------------------------
  {
    itemNumber: '701',
    description: 'Brief health assessment — less than 30 minutes',
    category: 'Professional attendances',
    group: 'Health assessments',
    scheduleFeeCents: 6740,
    benefitPercent: 100,
    maxMinutes: 30,
    frequencyLimitMonths: 12,
    effectiveFrom: '2026-08-01',
  },
  {
    itemNumber: '703',
    description: 'Standard health assessment — at least 30 and less than 45 minutes',
    category: 'Professional attendances',
    group: 'Health assessments',
    scheduleFeeCents: 15680,
    benefitPercent: 100,
    minMinutes: 30,
    maxMinutes: 45,
    frequencyLimitMonths: 12,
    effectiveFrom: '2026-08-01',
  },
  {
    itemNumber: '705',
    description: 'Long health assessment — at least 45 and less than 60 minutes',
    category: 'Professional attendances',
    group: 'Health assessments',
    scheduleFeeCents: 21645,
    benefitPercent: 100,
    minMinutes: 45,
    maxMinutes: 60,
    frequencyLimitMonths: 12,
    effectiveFrom: '2026-08-01',
  },
  {
    itemNumber: '707',
    description: 'Prolonged health assessment — 60 minutes or more',
    category: 'Professional attendances',
    group: 'Health assessments',
    scheduleFeeCents: 30575,
    benefitPercent: 100,
    minMinutes: 60,
    frequencyLimitMonths: 12,
    effectiveFrom: '2026-08-01',
  },
  {
    itemNumber: '715',
    description: 'Aboriginal and Torres Strait Islander health assessment',
    category: 'Professional attendances',
    group: 'Health assessments',
    scheduleFeeCents: 25415,
    benefitPercent: 100,
    frequencyLimitMonths: 12,
    effectiveFrom: '2026-08-01',
    notes: 'Any age. Claimable annually.',
  },

  // --- Mental health -------------------------------------------------------
  {
    itemNumber: '2700',
    description: 'Prepare a GP Mental Health Treatment Plan — at least 20 minutes',
    category: 'Professional attendances',
    group: 'GP mental health treatment',
    scheduleFeeCents: 10130,
    benefitPercent: 100,
    minMinutes: 20,
    maxMinutes: 40,
    effectiveFrom: '2026-08-01',
  },
  {
    itemNumber: '2701',
    description: 'Prepare a GP Mental Health Treatment Plan — at least 40 minutes',
    category: 'Professional attendances',
    group: 'GP mental health treatment',
    scheduleFeeCents: 14915,
    benefitPercent: 100,
    minMinutes: 40,
    effectiveFrom: '2026-08-01',
  },
  {
    itemNumber: '2715',
    description:
      'Prepare a GP Mental Health Treatment Plan (Mental Health Skills Training) — at least 20 minutes',
    category: 'Professional attendances',
    group: 'GP mental health treatment',
    scheduleFeeCents: 13010,
    benefitPercent: 100,
    minMinutes: 20,
    maxMinutes: 40,
    requiresMentalHealthSkillsTraining: true,
    effectiveFrom: '2026-08-01',
    notes: 'Requires GPMHSC-accredited Mental Health Skills Training.',
  },
  {
    itemNumber: '2717',
    description:
      'Prepare a GP Mental Health Treatment Plan (Mental Health Skills Training) — at least 40 minutes',
    category: 'Professional attendances',
    group: 'GP mental health treatment',
    scheduleFeeCents: 19170,
    benefitPercent: 100,
    minMinutes: 40,
    requiresMentalHealthSkillsTraining: true,
    effectiveFrom: '2026-08-01',
    notes: 'Requires GPMHSC-accredited Mental Health Skills Training.',
  },
  {
    itemNumber: '2712',
    description: 'Review a GP Mental Health Treatment Plan',
    category: 'Professional attendances',
    group: 'GP mental health treatment',
    scheduleFeeCents: 8065,
    benefitPercent: 100,
    minMinutes: 20,
    effectiveFrom: '2026-08-01',
  },

  // --- Out of consulting rooms --------------------------------------------
  {
    itemNumber: '24',
    description: 'Level B consultation — out of consulting rooms',
    category: 'Professional attendances',
    group: 'A1 General practitioner attendances',
    scheduleFeeCents: 6220,
    benefitPercent: 100,
    maxMinutes: 20,
    bulkBillIncentiveEligible: true,
    effectiveFrom: '2026-08-01',
    notes: 'Home visits and other institutions.',
  },
  {
    itemNumber: '5010',
    description: 'Residential aged care facility attendance — one patient',
    category: 'Professional attendances',
    group: 'Residential aged care',
    scheduleFeeCents: 6220,
    benefitPercent: 100,
    effectiveFrom: '2026-08-01',
  },

  // --- After hours ---------------------------------------------------------
  {
    itemNumber: '5020',
    description: 'After-hours attendance — Level B',
    category: 'Professional attendances',
    group: 'After hours attendances',
    scheduleFeeCents: 6035,
    benefitPercent: 100,
    maxMinutes: 20,
    bulkBillIncentiveEligible: true,
    effectiveFrom: '2026-08-01',
  },
  {
    itemNumber: '597',
    description: 'Urgent after-hours attendance',
    category: 'Professional attendances',
    group: 'After hours attendances',
    scheduleFeeCents: 16070,
    benefitPercent: 100,
    effectiveFrom: '2026-08-01',
  },

  // --- Bulk billing incentives ---------------------------------------------
  {
    itemNumber: '75870',
    description: 'Bulk billing incentive — metropolitan',
    category: 'Incentives',
    group: 'Bulk billing incentives',
    scheduleFeeCents: 2185,
    benefitPercent: 100,
    effectiveFrom: '2025-11-01',
    notes:
      'From 1 November 2025 extended to all Medicare-eligible patients registered with MyMedicare.',
  },
  {
    itemNumber: '75871',
    description: 'Bulk billing incentive — regional and rural',
    category: 'Incentives',
    group: 'Bulk billing incentives',
    scheduleFeeCents: 3390,
    benefitPercent: 100,
    effectiveFrom: '2025-11-01',
  },

  // --- Nurse and procedural -------------------------------------------------
  {
    itemNumber: '10997',
    description: 'Practice nurse service for a patient with a chronic condition',
    category: 'Professional attendances',
    group: 'Practice nurse items',
    scheduleFeeCents: 1360,
    benefitPercent: 100,
    effectiveFrom: '2026-08-01',
  },
  {
    itemNumber: '10990',
    description: 'Bulk billing incentive (legacy)',
    category: 'Incentives',
    group: 'Bulk billing incentives',
    scheduleFeeCents: 1310,
    benefitPercent: 100,
    effectiveFrom: '2026-08-01',
  },
  {
    itemNumber: '30071',
    description: 'Excision of skin lesion, benign',
    category: 'Therapeutic procedures',
    group: 'Minor surgery',
    scheduleFeeCents: 7565,
    benefitPercent: 75,
    effectiveFrom: '2026-08-01',
  },
  {
    itemNumber: '11506',
    description: 'Spirometry with graphical recording',
    category: 'Diagnostic procedures',
    group: 'Respiratory function',
    scheduleFeeCents: 2545,
    benefitPercent: 85,
    effectiveFrom: '2026-08-01',
  },
  {
    itemNumber: '11707',
    description: 'Electrocardiography — tracing and report',
    category: 'Diagnostic procedures',
    group: 'Cardiovascular',
    scheduleFeeCents: 3060,
    benefitPercent: 85,
    effectiveFrom: '2026-08-01',
  },
];

/** Practice-defined items with no Medicare rebate. */
export interface NonMedicareItemSeed {
  code: string;
  description: string;
  defaultFeeCents: number;
}

export const NON_MEDICARE_ITEM_SEED: NonMedicareItemSeed[] = [
  { code: 'NM-DRIVER', description: "Commercial drivers' medical", defaultFeeCents: 18500 },
  { code: 'NM-PREEMP', description: 'Pre-employment medical', defaultFeeCents: 22000 },
  { code: 'NM-INSREP', description: 'Insurance medical report', defaultFeeCents: 27500 },
  { code: 'NM-TRAVEL', description: 'Travel medicine consultation', defaultFeeCents: 9500 },
  { code: 'NM-IRONINF', description: 'Iron infusion — consumables', defaultFeeCents: 6500 },
  { code: 'NM-DRESS', description: 'Dressing and consumables', defaultFeeCents: 3500 },
  { code: 'NM-DNA', description: 'Missed appointment fee', defaultFeeCents: 3000 },
];

/** Suggest the time-tiered GP attendance item for a recorded duration. */
export function suggestAttendanceItem(minutes: number): string {
  if (minutes >= 40) return '44';
  if (minutes >= 20) return '36';
  if (minutes >= 6) return '23';
  return '3';
}
