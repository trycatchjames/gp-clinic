import { boolean, date, index, integer, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core';
import { id, timestamps } from './_shared';

/**
 * MBS reference data. Not tenant-scoped, and versioned by effective date so that a
 * July invoice is not repriced by a November fee.
 * See docs/90-reference/mbs-item-reference.md.
 */
export const mbsItems = pgTable(
  'mbs_items',
  {
    id: id(),
    itemNumber: text('item_number').notNull(),
    description: text('description').notNull(),
    category: text('category').notNull(),
    group: text('group').notNull(),
    scheduleFeeCents: integer('schedule_fee_cents').notNull(),
    benefitPercent: integer('benefit_percent').default(100).notNull(),

    /** Time tier bounds for attendance items, in minutes. */
    minMinutes: integer('min_minutes'),
    maxMinutes: integer('max_minutes'),

    /** MBS 2715/2717 require GPMHSC-accredited Mental Health Skills Training. */
    requiresMentalHealthSkillsTraining: boolean('requires_mental_health_skills_training')
      .default(false)
      .notNull(),
    requiresMyMedicare: boolean('requires_mymedicare').default(false).notNull(),
    bulkBillIncentiveEligible: boolean('bulk_bill_incentive_eligible')
      .default(false)
      .notNull(),
    frequencyLimitMonths: integer('frequency_limit_months'),

    effectiveFrom: date('effective_from').notNull(),
    effectiveTo: date('effective_to'),
    notes: text('notes'),
    ...timestamps,
  },
  (t) => [
    uniqueIndex('mbs_items_number_from_unique').on(t.itemNumber, t.effectiveFrom),
    index('mbs_items_group_idx').on(t.group),
  ],
);
