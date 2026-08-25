import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, asc, eq, ilike, or, sql as raw } from 'drizzle-orm';
import { DATABASE } from '../../db/database.module';
import type { Database } from '../../db/client';
import { feeScheduleItems, feeSchedules, mbsItems } from '../../db/schema';
import { BusinessRuleException } from '../../common/problem-details';
import type {
  FeeScheduleDto,
  FeeScheduleItemDto,
  MbsItemDto,
  UpdateFeeScheduleItemDto,
} from './billing.dto';

@Injectable()
export class BillingService {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  async listFeeSchedules(practiceId: string): Promise<FeeScheduleDto[]> {
    const rows = await this.db
      .select({
        schedule: feeSchedules,
        itemCount: raw<number>`count(${feeScheduleItems.id})::int`,
      })
      .from(feeSchedules)
      .leftJoin(feeScheduleItems, eq(feeScheduleItems.feeScheduleId, feeSchedules.id))
      .where(eq(feeSchedules.practiceId, practiceId))
      .groupBy(feeSchedules.id)
      .orderBy(asc(feeSchedules.createdAt));

    return rows.map(({ schedule, itemCount }) => ({
      id: schedule.id,
      kind: schedule.kind,
      name: schedule.name,
      isEditable: schedule.isEditable,
      isDefault: schedule.isDefault,
      effectiveFrom: schedule.effectiveFrom,
      itemCount,
    }));
  }

  async listFeeScheduleItems(
    practiceId: string,
    scheduleId: string,
    search?: string,
  ): Promise<FeeScheduleItemDto[]> {
    const filters = [
      eq(feeScheduleItems.practiceId, practiceId),
      eq(feeScheduleItems.feeScheduleId, scheduleId),
    ];
    if (search) {
      filters.push(
        or(
          ilike(feeScheduleItems.itemCode, `%${search}%`),
          ilike(feeScheduleItems.description, `%${search}%`),
        )!,
      );
    }

    const rows = await this.db
      .select()
      .from(feeScheduleItems)
      .where(and(...filters))
      .orderBy(asc(feeScheduleItems.itemCode))
      .limit(500);

    return rows.map((row) => ({
      id: row.id,
      itemCode: row.itemCode,
      description: row.description,
      feeCents: row.feeCents,
      benefitCents: row.benefitCents,
      // The gap is what the patient experiences, and what C1.5 requires be disclosed.
      gapCents: Math.max(0, row.feeCents - row.benefitCents),
      mbsItemId: row.mbsItemId,
      effectiveFrom: row.effectiveFrom,
    }));
  }

  async updateFeeScheduleItem(
    practiceId: string,
    scheduleId: string,
    itemId: string,
    userId: string,
    dto: UpdateFeeScheduleItemDto,
  ): Promise<FeeScheduleItemDto> {
    const [schedule] = await this.db
      .select()
      .from(feeSchedules)
      .where(and(eq(feeSchedules.practiceId, practiceId), eq(feeSchedules.id, scheduleId)))
      .limit(1);
    if (!schedule) throw new NotFoundException('Fee schedule not found');

    // The Bulk Bill schedule *is* the Medicare benefit; DVA is set by DVA.
    if (!schedule.isEditable) {
      throw new BusinessRuleException(
        'fee-schedule-not-editable',
        `The ${schedule.name} schedule is fixed`,
        'This schedule is locked to its external fee schedule and cannot be edited.',
      );
    }

    const [row] = await this.db
      .update(feeScheduleItems)
      .set({ feeCents: dto.feeCents, updatedAt: new Date(), updatedBy: userId })
      .where(
        and(eq(feeScheduleItems.feeScheduleId, scheduleId), eq(feeScheduleItems.id, itemId)),
      )
      .returning();
    if (!row) throw new NotFoundException('Fee schedule item not found');

    return {
      id: row.id,
      itemCode: row.itemCode,
      description: row.description,
      feeCents: row.feeCents,
      benefitCents: row.benefitCents,
      gapCents: Math.max(0, row.feeCents - row.benefitCents),
      mbsItemId: row.mbsItemId,
      effectiveFrom: row.effectiveFrom,
    };
  }

  async listMbsItems(search?: string, group?: string): Promise<MbsItemDto[]> {
    const filters = [];
    if (search) {
      filters.push(
        or(
          ilike(mbsItems.itemNumber, `%${search}%`),
          ilike(mbsItems.description, `%${search}%`),
        )!,
      );
    }
    if (group) filters.push(eq(mbsItems.group, group));

    const rows = await this.db
      .select()
      .from(mbsItems)
      .where(filters.length ? and(...filters) : undefined)
      .orderBy(asc(mbsItems.group), asc(mbsItems.itemNumber))
      .limit(500);

    return rows.map((row) => ({
      id: row.id,
      itemNumber: row.itemNumber,
      description: row.description,
      category: row.category,
      group: row.group,
      scheduleFeeCents: row.scheduleFeeCents,
      benefitPercent: row.benefitPercent,
      benefitCents: Math.round((row.scheduleFeeCents * row.benefitPercent) / 100),
      minMinutes: row.minMinutes,
      maxMinutes: row.maxMinutes,
      requiresMentalHealthSkillsTraining: row.requiresMentalHealthSkillsTraining,
      requiresMyMedicare: row.requiresMyMedicare,
      bulkBillIncentiveEligible: row.bulkBillIncentiveEligible,
      frequencyLimitMonths: row.frequencyLimitMonths,
      effectiveFrom: row.effectiveFrom,
      notes: row.notes,
    }));
  }
}
