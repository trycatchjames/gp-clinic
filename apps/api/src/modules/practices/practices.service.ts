import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, eq, isNotNull } from 'drizzle-orm';
import {
  isValidAbn,
  isValidAcn,
  ONBOARDING_STEPS,
  ONBOARDING_STEP_DESCRIPTIONS,
  ONBOARDING_STEP_LABELS,
  type OnboardingStep,
} from '@gp/contracts';
import { DATABASE } from '../../db/database.module';
import type { Database } from '../../db/client';
import {
  appointmentTypes,
  billingCohortRules,
  feeSchedules,
  locationBusinessHours,
  onboardingProgress,
  practiceBillingSettings,
  practiceLocations,
  practiceMemberships,
  practiceRegistrations,
  practices,
  practitionerLocations,
  practitioners,
} from '../../db/schema';
import { uuidv7 } from '../../db/uuid';
import { AuditService } from '../../common/audit.service';
import { BusinessRuleException, DomainException } from '../../common/problem-details';
import { PracticeSeedService } from './practice-seed.service';
import type {
  BillingSettingsDto,
  ChecklistItemDto,
  CreatePracticeDto,
  OnboardingStatusDto,
  PracticeDto,
  PracticeRegistrationsDto,
  UpdateBillingSettingsDto,
  UpdatePracticeDto,
  UpdateRegistrationsDto,
} from './practices.dto';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class PracticesService {
  constructor(
    @Inject(DATABASE) private readonly db: Database,
    private readonly seeder: PracticeSeedService,
    private readonly audit: AuditService,
  ) {}

  async create(userId: string, dto: CreatePracticeDto): Promise<PracticeDto> {
    const [existingMembership] = await this.db
      .select({ id: practiceMemberships.id })
      .from(practiceMemberships)
      .where(
        and(eq(practiceMemberships.userId, userId), eq(practiceMemberships.status, 'active')),
      )
      .limit(1);
    if (existingMembership) {
      throw new ConflictException('You already belong to a practice');
    }

    if (dto.abn && !isValidAbn(dto.abn)) {
      throw new DomainException(
        HttpStatus.UNPROCESSABLE_ENTITY,
        'invalid-abn',
        'ABN is not valid',
        'This ABN does not pass the ATO checksum — please check the digits.',
        [{ field: 'abn', message: 'This ABN is not valid — please check the digits' }],
      );
    }
    if (dto.acn && !isValidAcn(dto.acn)) {
      throw new DomainException(
        HttpStatus.UNPROCESSABLE_ENTITY,
        'invalid-acn',
        'ACN is not valid',
        'This ACN does not pass the checksum — please check the digits.',
        [{ field: 'acn', message: 'This ACN is not valid — please check the digits' }],
      );
    }

    const [practice] = await this.db
      .insert(practices)
      .values({
        id: uuidv7(),
        legalName: dto.legalName.trim(),
        tradingName: dto.tradingName.trim(),
        entityType: dto.entityType as never,
        practiceType: (dto.practiceType ?? 'general_practice') as never,
        abn: dto.abn?.replace(/\s/g, ''),
        acn: dto.acn?.replace(/\s/g, ''),
        contactEmail: dto.contactEmail,
        contactPhone: dto.contactPhone,
        createdBy: userId,
      })
      .returning();

    // The person who creates a practice is always its owner.
    await this.db.insert(practiceMemberships).values({
      id: uuidv7(),
      practiceId: practice.id,
      userId,
      role: 'practice_owner',
    });

    await this.db.insert(practiceRegistrations).values({ id: uuidv7(), practiceId: practice.id });
    await this.db.insert(practiceBillingSettings).values({
      id: uuidv7(),
      practiceId: practice.id,
    });
    await this.db.insert(onboardingProgress).values(
      ONBOARDING_STEPS.map((step) => ({
        id: uuidv7(),
        practiceId: practice.id,
        step,
        // Identity is captured by this very request.
        status: (step === 'practice_identity' ? 'complete' : 'not_started') as never,
        completedAt: step === 'practice_identity' ? new Date() : null,
      })),
    );

    await this.seeder.seedPractice(practice.id);

    await this.audit.record({
      practiceId: practice.id,
      actorUserId: userId,
      action: 'practice.created',
      entityType: 'Practice',
      entityId: practice.id,
    });

    return toPracticeDto(practice);
  }

  async findOne(practiceId: string): Promise<PracticeDto> {
    const [practice] = await this.db
      .select()
      .from(practices)
      .where(eq(practices.id, practiceId))
      .limit(1);
    if (!practice) throw new NotFoundException('Practice not found');
    return toPracticeDto(practice);
  }

  async update(
    practiceId: string,
    userId: string,
    dto: UpdatePracticeDto,
  ): Promise<PracticeDto> {
    if (dto.abn && !isValidAbn(dto.abn)) {
      throw new DomainException(
        HttpStatus.UNPROCESSABLE_ENTITY,
        'invalid-abn',
        'ABN is not valid',
        'This ABN does not pass the ATO checksum.',
        [{ field: 'abn', message: 'This ABN is not valid — please check the digits' }],
      );
    }

    const [practice] = await this.db
      .update(practices)
      .set({
        ...dto,
        entityType: dto.entityType as never,
        practiceType: dto.practiceType as never,
        abn: dto.abn?.replace(/\s/g, ''),
        updatedAt: new Date(),
        updatedBy: userId,
      })
      .where(eq(practices.id, practiceId))
      .returning();
    if (!practice) throw new NotFoundException('Practice not found');
    return toPracticeDto(practice);
  }

  // --- registrations -------------------------------------------------------

  async getRegistrations(practiceId: string): Promise<PracticeRegistrationsDto> {
    const [row] = await this.db
      .select()
      .from(practiceRegistrations)
      .where(eq(practiceRegistrations.practiceId, practiceId))
      .limit(1);
    if (!row) throw new NotFoundException('Practice registrations not found');
    return toRegistrationsDto(row);
  }

  async updateRegistrations(
    practiceId: string,
    userId: string,
    dto: UpdateRegistrationsDto,
  ): Promise<PracticeRegistrationsDto> {
    const current = await this.getRegistrations(practiceId);
    const myMedicareStatus = dto.myMedicareStatus ?? current.myMedicareStatus;

    // BBPIP requires MyMedicare registration — the two are checked together.
    if (dto.bbpipParticipating && myMedicareStatus !== 'registered') {
      throw new BusinessRuleException(
        'bbpip-requires-mymedicare',
        'BBPIP requires MyMedicare registration',
        'Participation in the Bulk Billing Practice Incentive Program requires the practice to be registered for MyMedicare.',
      );
    }

    const [row] = await this.db
      .update(practiceRegistrations)
      .set({
        ...dto,
        myMedicareStatus: dto.myMedicareStatus as never,
        accreditationStatus: dto.accreditationStatus as never,
        updatedAt: new Date(),
        updatedBy: userId,
      })
      .where(eq(practiceRegistrations.practiceId, practiceId))
      .returning();

    // Opting into BBPIP obliges the practice to bulk bill 100% of eligible services,
    // so the billing policy follows.
    if (dto.bbpipParticipating === true) {
      await this.db
        .update(practiceBillingSettings)
        .set({ billingPolicy: 'bulk_bill_all', updatedAt: new Date() })
        .where(eq(practiceBillingSettings.practiceId, practiceId));
    }

    await this.audit.record({
      practiceId,
      actorUserId: userId,
      action: 'practice.registrations_updated',
      entityType: 'PracticeRegistrations',
      entityId: row.id,
      context: { bbpipParticipating: row.bbpipParticipating },
    });

    return toRegistrationsDto(row);
  }

  // --- billing settings ----------------------------------------------------

  async getBillingSettings(practiceId: string): Promise<BillingSettingsDto> {
    const [settings] = await this.db
      .select()
      .from(practiceBillingSettings)
      .where(eq(practiceBillingSettings.practiceId, practiceId))
      .limit(1);
    if (!settings) throw new NotFoundException('Billing settings not found');

    const cohorts = await this.db
      .select()
      .from(billingCohortRules)
      .where(eq(billingCohortRules.practiceId, practiceId));
    const registrations = await this.getRegistrations(practiceId);

    return {
      practiceId,
      billingPolicy: settings.billingPolicy,
      privateFeeMultiplier: settings.privateFeeMultiplier,
      privateFeeRoundingCents: settings.privateFeeRoundingCents,
      suggestBulkBillIncentives: settings.suggestBulkBillIncentives,
      bulkBillCohorts: cohorts.filter((c) => c.bulkBill).map((c) => c.cohort),
      policyLockedByBbpip: registrations.bbpipParticipating,
    };
  }

  async updateBillingSettings(
    practiceId: string,
    userId: string,
    dto: UpdateBillingSettingsDto,
  ): Promise<BillingSettingsDto> {
    const registrations = await this.getRegistrations(practiceId);

    if (
      registrations.bbpipParticipating &&
      dto.billingPolicy &&
      dto.billingPolicy !== 'bulk_bill_all'
    ) {
      throw new BusinessRuleException(
        'bbpip-locks-billing-policy',
        'Billing policy is locked by BBPIP participation',
        'Participating practices must bulk bill 100% of eligible services. Withdraw from BBPIP first to change the policy.',
      );
    }

    const [settings] = await this.db
      .update(practiceBillingSettings)
      .set({
        billingPolicy: dto.billingPolicy as never,
        privateFeeMultiplier: dto.privateFeeMultiplier,
        privateFeeRoundingCents: dto.privateFeeRoundingCents,
        suggestBulkBillIncentives: dto.suggestBulkBillIncentives,
        updatedAt: new Date(),
        updatedBy: userId,
      })
      .where(eq(practiceBillingSettings.practiceId, practiceId))
      .returning();

    if (dto.bulkBillCohorts) {
      await this.db
        .delete(billingCohortRules)
        .where(eq(billingCohortRules.practiceId, practiceId));
      if (dto.bulkBillCohorts.length) {
        await this.db.insert(billingCohortRules).values(
          dto.bulkBillCohorts.map((cohort) => ({
            id: uuidv7(),
            practiceId,
            cohort,
            bulkBill: true,
          })),
        );
      }
    }

    if (dto.privateFeeMultiplier || dto.privateFeeRoundingCents) {
      await this.seeder.regeneratePrivateSchedule(
        practiceId,
        settings.privateFeeMultiplier,
        settings.privateFeeRoundingCents,
      );
    }

    return this.getBillingSettings(practiceId);
  }

  // --- onboarding ----------------------------------------------------------

  async getOnboardingStatus(practiceId: string): Promise<OnboardingStatusDto> {
    const [practice] = await this.db
      .select()
      .from(practices)
      .where(eq(practices.id, practiceId))
      .limit(1);
    if (!practice) throw new NotFoundException('Practice not found');

    const progress = await this.db
      .select()
      .from(onboardingProgress)
      .where(eq(onboardingProgress.practiceId, practiceId));

    const steps = ONBOARDING_STEPS.map((step) => {
      const row = progress.find((p) => p.step === step);
      return {
        step,
        label: ONBOARDING_STEP_LABELS[step as OnboardingStep],
        description: ONBOARDING_STEP_DESCRIPTIONS[step as OnboardingStep],
        status: row?.status ?? 'not_started',
        completedAt: row?.completedAt?.toISOString() ?? null,
      };
    });

    const { required, recommended } = await this.buildChecklist(practiceId, practice);
    const all = [...required, ...recommended];
    const satisfied = all.filter((i) => i.satisfied).length;

    return {
      practiceId,
      onboardingStatus: practice.onboardingStatus,
      steps,
      required,
      recommended,
      canActivate: required.every((i) => i.satisfied),
      completionPercent: all.length ? Math.round((satisfied / all.length) * 100) : 0,
    };
  }

  async setStepStatus(
    practiceId: string,
    step: string,
    status: string,
    userId: string,
  ): Promise<OnboardingStatusDto> {
    if (!ONBOARDING_STEPS.includes(step as OnboardingStep)) {
      throw new NotFoundException(`Unknown onboarding step: ${step}`);
    }
    await this.db
      .update(onboardingProgress)
      .set({
        status: status as never,
        completedAt: status === 'complete' ? new Date() : null,
        updatedAt: new Date(),
        updatedBy: userId,
      })
      .where(
        and(
          eq(onboardingProgress.practiceId, practiceId),
          eq(onboardingProgress.step, step as never),
        ),
      );
    return this.getOnboardingStatus(practiceId);
  }

  async activate(practiceId: string, userId: string): Promise<PracticeDto> {
    const status = await this.getOnboardingStatus(practiceId);
    if (!status.canActivate) {
      const outstanding = status.required.filter((i) => !i.satisfied).map((i) => i.label);
      throw new BusinessRuleException(
        'activation-requirements-not-met',
        'The practice cannot be activated yet',
        `Still outstanding: ${outstanding.join('; ')}.`,
      );
    }

    const [practice] = await this.db
      .update(practices)
      .set({ onboardingStatus: 'active', activatedAt: new Date(), updatedBy: userId })
      .where(eq(practices.id, practiceId))
      .returning();

    await this.db
      .update(onboardingProgress)
      .set({ status: 'complete', completedAt: new Date() })
      .where(
        and(
          eq(onboardingProgress.practiceId, practiceId),
          eq(onboardingProgress.step, 'review'),
        ),
      );

    await this.audit.record({
      practiceId,
      actorUserId: userId,
      action: 'practice.activated',
      entityType: 'Practice',
      entityId: practiceId,
    });

    return toPracticeDto(practice);
  }

  /**
   * The activation checklist. Required items block; recommended items keep showing
   * on the dashboard until done. Blocking a practice from working because it has
   * not entered its HPI-O yet is how software gets abandoned.
   */
  private async buildChecklist(
    practiceId: string,
    practice: typeof practices.$inferSelect,
  ): Promise<{ required: ChecklistItemDto[]; recommended: ChecklistItemDto[] }> {
    const [locations, providerNumbers, types, schedules, registrations, hours] =
      await Promise.all([
        this.db.select().from(practiceLocations).where(eq(practiceLocations.practiceId, practiceId)),
        this.db
          .select()
          .from(practitionerLocations)
          .innerJoin(practitioners, eq(practitioners.id, practitionerLocations.practitionerId))
          .where(
            and(
              eq(practitionerLocations.practiceId, practiceId),
              eq(practitioners.isActive, true),
              isNotNull(practitionerLocations.providerNumber),
            ),
          ),
        this.db.select().from(appointmentTypes).where(eq(appointmentTypes.practiceId, practiceId)),
        this.db.select().from(feeSchedules).where(eq(feeSchedules.practiceId, practiceId)),
        this.getRegistrations(practiceId),
        this.db
          .select()
          .from(locationBusinessHours)
          .where(eq(locationBusinessHours.practiceId, practiceId)),
      ]);

    const required: ChecklistItemDto[] = [
      {
        key: 'practice_identity',
        label: 'Practice name and entity type',
        satisfied: Boolean(practice.legalName && practice.tradingName),
        rationale: 'Identifies the business on every invoice and patient communication.',
      },
      {
        key: 'location',
        label: 'At least one location with an address and timezone',
        satisfied: locations.some((l) => l.isActive && l.streetAddress && l.timezone),
        rationale:
          'Provider numbers, books, banking and fee schedules are all scoped to a location.',
      },
      {
        key: 'provider_number',
        label: 'At least one practitioner with a provider number at that location',
        satisfied: providerNumbers.length > 0,
        rationale:
          'Medicare provider numbers are issued per practitioner per location. Billing with the wrong one is a rejected claim.',
      },
      {
        key: 'appointment_type',
        label: 'At least one appointment type',
        satisfied: types.some((t) => t.isActive),
        rationale: 'Nothing can be booked until the book knows what it is booking.',
      },
      {
        key: 'fee_schedule',
        label: 'At least one fee schedule',
        satisfied: schedules.length > 0,
        rationale: 'Services cannot be priced without one.',
      },
    ];

    const recommended: ChecklistItemDto[] = [
      {
        key: 'abn',
        label: 'ABN',
        satisfied: Boolean(practice.abn),
        rationale: 'Required on tax invoices.',
      },
      {
        key: 'hpi_o',
        label: 'HPI-O for each location',
        satisfied: locations.length > 0 && locations.every((l) => Boolean(l.hpiO)),
        rationale:
          'The Healthcare Provider Identifier — Organisation is needed for eScripts and My Health Record.',
      },
      {
        key: 'minor_id',
        label: 'Medicare Minor ID for each location',
        satisfied: locations.length > 0 && locations.every((l) => Boolean(l.medicareMinorId)),
        rationale: 'Needed to claim and to be paid.',
      },
      {
        key: 'opening_hours',
        label: 'Opening hours',
        satisfied: hours.length > 0,
        rationale:
          'RACGP C1.1 requires patients to be told when you are open. The book uses it too.',
      },
      {
        key: 'after_hours',
        label: 'After-hours arrangement',
        satisfied: locations.length > 0 && locations.every((l) => Boolean(l.afterHoursArrangement)),
        rationale:
          'RACGP GP1.3 requires arrangements for care outside normal opening hours, communicated to patients.',
      },
      {
        key: 'mymedicare',
        label: 'MyMedicare registration',
        satisfied: registrations.myMedicareStatus === 'registered',
        rationale:
          'Gates the chronic condition management items, longer telehealth and BBPIP participation.',
      },
      {
        key: 'accreditation',
        label: 'Accreditation details',
        satisfied: registrations.accreditationStatus === 'accredited',
        rationale: 'Needed for PIP payments and required by most incentive programs.',
      },
    ];

    return { required, recommended };
  }
}

function toPracticeDto(row: typeof practices.$inferSelect): PracticeDto {
  return {
    id: row.id,
    legalName: row.legalName,
    tradingName: row.tradingName,
    entityType: row.entityType,
    practiceType: row.practiceType,
    abn: row.abn,
    acn: row.acn,
    contactEmail: row.contactEmail,
    contactPhone: row.contactPhone,
    website: row.website,
    onboardingStatus: row.onboardingStatus,
    activatedAt: row.activatedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
  };
}

function toRegistrationsDto(
  row: typeof practiceRegistrations.$inferSelect,
): PracticeRegistrationsDto {
  return {
    practiceId: row.practiceId,
    prodaOrganisationName: row.prodaOrganisationName,
    prodaRaNumber: row.prodaRaNumber,
    myMedicareStatus: row.myMedicareStatus,
    myMedicareRegisteredOn: row.myMedicareRegisteredOn,
    bbpipParticipating: row.bbpipParticipating,
    bbpipEffectiveFrom: row.bbpipEffectiveFrom,
    accreditationStatus: row.accreditationStatus,
    accreditingBody: row.accreditingBody,
    accreditationExpiresOn: row.accreditationExpiresOn,
    pipParticipating: row.pipParticipating,
    wipParticipating: row.wipParticipating,
  };
}
