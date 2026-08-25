import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, asc, eq, gt } from 'drizzle-orm';
import {
  ON_SITE_SUPERVISION_LEVELS,
  PRACTITIONER_KIND_LABELS,
  QUALIFICATION_LABELS,
  type PractitionerKind,
  type QualificationType,
  type SupervisionLevel,
} from '@gp/contracts';
import { DATABASE } from '../../db/database.module';
import type { Database } from '../../db/client';
import {
  appointments,
  practiceLocations,
  practitionerLocations,
  practitionerQualifications,
  practitioners,
  supervisionRelationships,
} from '../../db/schema';
import { uuidv7 } from '../../db/uuid';
import { AuditService } from '../../common/audit.service';
import { BusinessRuleException } from '../../common/problem-details';
import type {
  CreatePractitionerDto,
  CreateQualificationDto,
  CreateSupervisionDto,
  PractitionerDto,
  ProviderNumberDto,
  QualificationDto,
  SetProviderNumberDto,
  SupervisionDto,
  UpdatePractitionerDto,
} from './practitioners.dto';

@Injectable()
export class PractitionersService {
  constructor(
    @Inject(DATABASE) private readonly db: Database,
    private readonly audit: AuditService,
  ) {}

  async list(practiceId: string): Promise<PractitionerDto[]> {
    const rows = await this.db
      .select()
      .from(practitioners)
      .where(eq(practitioners.practiceId, practiceId))
      .orderBy(asc(practitioners.familyName));
    return Promise.all(rows.map((row) => this.decorate(practiceId, row)));
  }

  async findOne(practiceId: string, practitionerId: string): Promise<PractitionerDto> {
    const [row] = await this.db
      .select()
      .from(practitioners)
      .where(
        and(eq(practitioners.practiceId, practiceId), eq(practitioners.id, practitionerId)),
      )
      .limit(1);
    if (!row) throw new NotFoundException('Practitioner not found');
    return this.decorate(practiceId, row);
  }

  async create(
    practiceId: string,
    userId: string,
    dto: CreatePractitionerDto,
  ): Promise<PractitionerDto> {
    const [row] = await this.db
      .insert(practitioners)
      .values({
        id: uuidv7(),
        practiceId,
        ...dto,
        kind: dto.kind as never,
        ahpraRegistrationType: dto.ahpraRegistrationType as never,
        createdBy: userId,
      })
      .returning();

    await this.audit.record({
      practiceId,
      actorUserId: userId,
      action: 'practitioner.created',
      entityType: 'Practitioner',
      entityId: row.id,
    });

    return this.decorate(practiceId, row);
  }

  async update(
    practiceId: string,
    practitionerId: string,
    userId: string,
    dto: UpdatePractitionerDto,
  ): Promise<PractitionerDto> {
    // Deactivation is blocked while future appointments remain.
    if (dto.isActive === false) {
      const future = await this.db
        .select({ id: appointments.id })
        .from(appointments)
        .where(
          and(
            eq(appointments.practitionerId, practitionerId),
            gt(appointments.startsAt, new Date()),
            eq(appointments.status, 'booked'),
          ),
        );
      if (future.length) {
        throw new BusinessRuleException(
          'practitioner-has-future-appointments',
          'This practitioner still has future appointments',
          `${future.length} appointment(s) must be reassigned or cancelled first.`,
        );
      }
    }

    // A registrar cannot be activated without a current supervision relationship.
    if (dto.isActive === true) {
      const [existing] = await this.db
        .select()
        .from(practitioners)
        .where(eq(practitioners.id, practitionerId))
        .limit(1);
      const kind = (dto.kind ?? existing?.kind) as PractitionerKind | undefined;
      if (kind === 'gp_registrar') {
        const supervision = await this.getSupervision(practiceId, practitionerId);
        if (!supervision) {
          throw new BusinessRuleException(
            'registrar-requires-supervision',
            'A registrar needs a supervision arrangement',
            'Record a supervisor and supervision level before activating this registrar.',
          );
        }
      }
    }

    const [row] = await this.db
      .update(practitioners)
      .set({
        ...dto,
        kind: dto.kind as never,
        ahpraRegistrationType: dto.ahpraRegistrationType as never,
        updatedAt: new Date(),
        updatedBy: userId,
      })
      .where(
        and(eq(practitioners.practiceId, practiceId), eq(practitioners.id, practitionerId)),
      )
      .returning();
    if (!row) throw new NotFoundException('Practitioner not found');

    await this.audit.record({
      practiceId,
      actorUserId: userId,
      action: 'practitioner.updated',
      entityType: 'Practitioner',
      entityId: practitionerId,
    });

    return this.decorate(practiceId, row);
  }

  /**
   * Provider numbers are per practitioner per location — the single most common
   * cause of rejected Medicare claims when modelled as a single field.
   */
  async setProviderNumber(
    practiceId: string,
    practitionerId: string,
    userId: string,
    dto: SetProviderNumberDto,
  ): Promise<ProviderNumberDto[]> {
    const [location] = await this.db
      .select()
      .from(practiceLocations)
      .where(
        and(
          eq(practiceLocations.practiceId, practiceId),
          eq(practiceLocations.id, dto.locationId),
        ),
      )
      .limit(1);
    if (!location) throw new NotFoundException('Location not found');

    await this.db
      .insert(practitionerLocations)
      .values({
        id: uuidv7(),
        practiceId,
        practitionerId,
        locationId: dto.locationId,
        providerNumber: dto.providerNumber,
        createdBy: userId,
      })
      .onConflictDoUpdate({
        target: [practitionerLocations.practitionerId, practitionerLocations.locationId],
        set: { providerNumber: dto.providerNumber, updatedAt: new Date(), updatedBy: userId },
      });

    await this.audit.record({
      practiceId,
      actorUserId: userId,
      action: 'practitioner.provider_number_set',
      entityType: 'PractitionerLocation',
      entityId: practitionerId,
      context: { locationId: dto.locationId },
    });

    return this.getProviderNumbers(practiceId, practitionerId);
  }

  async getProviderNumbers(
    practiceId: string,
    practitionerId: string,
  ): Promise<ProviderNumberDto[]> {
    const locations = await this.db
      .select()
      .from(practiceLocations)
      .where(eq(practiceLocations.practiceId, practiceId))
      .orderBy(asc(practiceLocations.createdAt));

    const links = await this.db
      .select()
      .from(practitionerLocations)
      .where(eq(practitionerLocations.practitionerId, practitionerId));

    // Every location is listed, so a missing provider number is visible rather than absent.
    return locations.map((location) => {
      const link = links.find((l) => l.locationId === location.id);
      return {
        locationId: location.id,
        locationName: location.name,
        providerNumber: link?.providerNumber ?? null,
        isActive: link?.isActive ?? false,
      };
    });
  }

  async listQualifications(
    practiceId: string,
    practitionerId: string,
  ): Promise<QualificationDto[]> {
    const rows = await this.db
      .select()
      .from(practitionerQualifications)
      .where(
        and(
          eq(practitionerQualifications.practiceId, practiceId),
          eq(practitionerQualifications.practitionerId, practitionerId),
        ),
      );
    return rows.map((row) => ({
      id: row.id,
      qualificationType: row.qualificationType,
      label: QUALIFICATION_LABELS[row.qualificationType as QualificationType],
      description: row.description,
      issuingBody: row.issuingBody,
      obtainedOn: row.obtainedOn,
      expiresOn: row.expiresOn,
      daysUntilExpiry: row.expiresOn ? daysUntil(row.expiresOn) : null,
    }));
  }

  async addQualification(
    practiceId: string,
    practitionerId: string,
    userId: string,
    dto: CreateQualificationDto,
  ): Promise<QualificationDto[]> {
    await this.db.insert(practitionerQualifications).values({
      id: uuidv7(),
      practiceId,
      practitionerId,
      qualificationType: dto.qualificationType as never,
      description: dto.description,
      issuingBody: dto.issuingBody,
      obtainedOn: dto.obtainedOn,
      expiresOn: dto.expiresOn,
      createdBy: userId,
    });

    // Recording Mental Health Skills Training unlocks MBS items 2715 and 2717.
    if (dto.qualificationType === 'mental_health_skills_training') {
      await this.db
        .update(practitioners)
        .set({ mentalHealthSkillsTraining: true, updatedAt: new Date() })
        .where(eq(practitioners.id, practitionerId));
    }

    return this.listQualifications(practiceId, practitionerId);
  }

  async getSupervision(
    practiceId: string,
    registrarId: string,
  ): Promise<SupervisionDto | null> {
    const [row] = await this.db
      .select({
        supervision: supervisionRelationships,
        supervisorGiven: practitioners.givenName,
        supervisorFamily: practitioners.familyName,
        supervisorTitle: practitioners.title,
      })
      .from(supervisionRelationships)
      .innerJoin(practitioners, eq(practitioners.id, supervisionRelationships.supervisorId))
      .where(
        and(
          eq(supervisionRelationships.practiceId, practiceId),
          eq(supervisionRelationships.registrarId, registrarId),
        ),
      )
      .orderBy(asc(supervisionRelationships.effectiveFrom))
      .limit(1);

    if (!row) return null;
    return {
      id: row.supervision.id,
      registrarId: row.supervision.registrarId,
      supervisorId: row.supervision.supervisorId,
      supervisorName: [row.supervisorTitle, row.supervisorGiven, row.supervisorFamily]
        .filter(Boolean)
        .join(' '),
      supervisionLevel: row.supervision.supervisionLevel,
      trainingTerm: row.supervision.trainingTerm,
      trainingOrganisation: row.supervision.trainingOrganisation,
      effectiveFrom: row.supervision.effectiveFrom,
      effectiveTo: row.supervision.effectiveTo,
      requiresOnSiteSupervisor: ON_SITE_SUPERVISION_LEVELS.includes(
        row.supervision.supervisionLevel as SupervisionLevel,
      ),
    };
  }

  async setSupervision(
    practiceId: string,
    registrarId: string,
    userId: string,
    dto: CreateSupervisionDto,
  ): Promise<SupervisionDto> {
    const [supervisor] = await this.db
      .select()
      .from(practitioners)
      .where(
        and(eq(practitioners.practiceId, practiceId), eq(practitioners.id, dto.supervisorId)),
      )
      .limit(1);
    if (!supervisor) throw new NotFoundException('Supervisor not found');
    if (!supervisor.isSupervisor) {
      throw new BusinessRuleException(
        'not-a-supervisor',
        'That practitioner is not marked as a supervisor',
        'Mark the practitioner as a supervisor on their profile first.',
      );
    }

    await this.db
      .delete(supervisionRelationships)
      .where(
        and(
          eq(supervisionRelationships.practiceId, practiceId),
          eq(supervisionRelationships.registrarId, registrarId),
        ),
      );

    await this.db.insert(supervisionRelationships).values({
      id: uuidv7(),
      practiceId,
      registrarId,
      supervisorId: dto.supervisorId,
      supervisionLevel: dto.supervisionLevel as never,
      trainingTerm: dto.trainingTerm as never,
      trainingOrganisation: dto.trainingOrganisation,
      effectiveFrom: dto.effectiveFrom,
      effectiveTo: dto.effectiveTo,
      createdBy: userId,
    });

    await this.audit.record({
      practiceId,
      actorUserId: userId,
      action: 'practitioner.supervision_set',
      entityType: 'SupervisionRelationship',
      entityId: registrarId,
    });

    const supervision = await this.getSupervision(practiceId, registrarId);
    return supervision!;
  }

  private async decorate(
    practiceId: string,
    row: typeof practitioners.$inferSelect,
  ): Promise<PractitionerDto> {
    const providerNumbers = await this.getProviderNumbers(practiceId, row.id);
    const supervision =
      row.kind === 'gp_registrar' ? await this.getSupervision(practiceId, row.id) : null;

    const warnings: string[] = [];
    const missing = providerNumbers.filter((p) => !p.providerNumber);
    if (missing.length) {
      warnings.push(
        `No Medicare provider number at ${missing.map((m) => m.locationName).join(', ')}. They cannot be billed at those locations.`,
      );
    }
    if (row.kind === 'gp_registrar' && !supervision) {
      warnings.push('No supervision arrangement recorded. Required before activation.');
    }
    if (row.ahpraExpiresOn) {
      const days = daysUntil(row.ahpraExpiresOn);
      if (days < 0) warnings.push('AHPRA registration has expired.');
      else if (days <= 30) warnings.push(`AHPRA registration expires in ${days} days.`);
    }
    if (row.indemnityExpiresOn) {
      const days = daysUntil(row.indemnityExpiresOn);
      if (days < 0) warnings.push('Professional indemnity cover has expired.');
      else if (days <= 30) warnings.push(`Professional indemnity expires in ${days} days.`);
    }

    return {
      id: row.id,
      practiceId: row.practiceId,
      title: row.title,
      givenName: row.givenName,
      familyName: row.familyName,
      displayName: [row.title, row.preferredName ?? row.givenName, row.familyName]
        .filter(Boolean)
        .join(' '),
      preferredName: row.preferredName,
      gender: row.gender,
      kind: row.kind,
      kindLabel: PRACTITIONER_KIND_LABELS[row.kind as PractitionerKind],
      email: row.email,
      mobile: row.mobile,
      ahpraRegistrationNumber: row.ahpraRegistrationNumber,
      ahpraRegistrationType: row.ahpraRegistrationType,
      ahpraExpiresOn: row.ahpraExpiresOn,
      hpiI: row.hpiI,
      prescriberNumber: row.prescriberNumber,
      vocationalRegistration: row.vocationalRegistration,
      mentalHealthSkillsTraining: row.mentalHealthSkillsTraining,
      isSupervisor: row.isSupervisor,
      isActive: row.isActive,
      providerNumbers,
      supervision,
      warnings,
    };
  }
}

function daysUntil(isoDate: string): number {
  const target = new Date(`${isoDate}T00:00:00Z`).getTime();
  return Math.ceil((target - Date.now()) / 86400_000);
}
