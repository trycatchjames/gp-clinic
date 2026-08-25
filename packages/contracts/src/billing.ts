/** Billing, payers and Medicare programme constants. */

export const BILLING_POLICIES = ['bulk_bill_all', 'mixed', 'private'] as const;
export type BillingPolicy = (typeof BILLING_POLICIES)[number];

export const BILLING_POLICY_LABELS: Record<BillingPolicy, string> = {
  bulk_bill_all: 'Bulk bill all eligible services',
  mixed: 'Mixed billing',
  private: 'Private billing',
};

export const BILLING_POLICY_DESCRIPTIONS: Record<BillingPolicy, string> = {
  bulk_bill_all:
    'Every eligible service is bulk billed and the patient pays nothing. Required to participate in the Bulk Billing Practice Incentive Program.',
  mixed:
    'Bulk bill for concession card holders, children and other nominated groups. Private billing for everyone else.',
  private:
    'Private billing with a patient gap. Patients claim their rebate from Medicare.',
};

export const PAYERS = [
  'medicare_bulk_bill',
  'medicare_patient_claim',
  'private',
  'dva',
  'workcover',
  'ctp',
  'third_party',
  'no_charge',
] as const;
export type Payer = (typeof PAYERS)[number];

export const PAYER_LABELS: Record<Payer, string> = {
  medicare_bulk_bill: 'Medicare — bulk bill',
  medicare_patient_claim: 'Medicare — patient claim',
  private: 'Private',
  dva: 'DVA',
  workcover: 'WorkCover',
  ctp: 'CTP',
  third_party: 'Third party',
  no_charge: 'No charge',
};

export const FEE_SCHEDULE_KINDS = [
  'bulk_bill',
  'private',
  'dva',
  'workcover',
  'non_medicare',
] as const;
export type FeeScheduleKind = (typeof FEE_SCHEDULE_KINDS)[number];

export const FEE_SCHEDULE_LABELS: Record<FeeScheduleKind, string> = {
  bulk_bill: 'Bulk Bill (MBS)',
  private: 'Private',
  dva: 'DVA',
  workcover: 'WorkCover',
  non_medicare: 'Non-Medicare',
};

/** Fee schedules locked to an external schedule and not editable by the practice. */
export const LOCKED_FEE_SCHEDULE_KINDS: readonly FeeScheduleKind[] = ['bulk_bill', 'dva'];

export const DVA_CARD_COLOURS = ['gold', 'white', 'orange'] as const;
export type DvaCardColour = (typeof DVA_CARD_COLOURS)[number];

export const DVA_CARD_DESCRIPTIONS: Record<DvaCardColour, string> = {
  gold: 'All clinically necessary health care',
  white: 'Accepted conditions only',
  orange: 'Pharmaceuticals only',
};

/** Cohorts a mixed-billing practice can nominate for bulk billing. */
export const BILLING_COHORTS = [
  'commonwealth_concession_card',
  'pension_concession_card',
  'under_16',
  'over_65',
  'dva_card_holder',
  'aboriginal_or_torres_strait_islander',
  'mymedicare_registered',
] as const;
export type BillingCohort = (typeof BILLING_COHORTS)[number];

export const BILLING_COHORT_LABELS: Record<BillingCohort, string> = {
  commonwealth_concession_card: 'Commonwealth concession card holders',
  pension_concession_card: 'Pension concession card holders',
  under_16: 'Children under 16',
  over_65: 'Patients aged 65 and over',
  dva_card_holder: 'DVA card holders',
  aboriginal_or_torres_strait_islander: 'Aboriginal and Torres Strait Islander patients',
  mymedicare_registered: 'Patients registered in MyMedicare',
};

/**
 * Bulk Billing Practice Incentive Program.
 * From 1 November 2025: practices that bulk bill 100% of eligible services and are
 * registered for MyMedicare may opt in and receive an additional 12.5% on MBS benefits
 * from eligible services, split 50/50 between practice and practitioner.
 * See docs/50-billing/02-medicare-bulk-billing.md.
 */
export const BBPIP = {
  commencedOn: '2025-11-01',
  loadingPercent: 12.5,
  practitionerSharePercent: 50,
  requiredBulkBillingPercent: 100,
  requiresMyMedicare: true,
} as const;

export const CLAIM_STATUSES = [
  'draft',
  'submitted',
  'processing',
  'accepted',
  'rejected',
  'resubmitted',
  'part_paid',
  'paid',
] as const;
export type ClaimStatus = (typeof CLAIM_STATUSES)[number];

export const PAYMENT_METHODS = [
  'eftpos',
  'card',
  'cash',
  'direct_deposit',
  'account',
] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
