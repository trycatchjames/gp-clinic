import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, asc, eq } from 'drizzle-orm';
import { DATABASE } from '../../db/database.module';
import type { Database } from '../../db/client';
import {
  appointmentTypes,
  locationBusinessHours,
  practiceLocations,
  practitioners,
  sessionTemplates,
} from '../../db/schema';
import { uuidv7 } from '../../db/uuid';
import { BusinessRuleException } from '../../common/problem-details';
import type {
  AppointmentTypeDto,
  CreateAppointmentTypeDto,
  CreateSessionTemplateDto,
  SessionTemplateDto,
  UpdateAppointmentTypeDto,
} from './appointment-types.dto';

@Injectable()
export class AppointmentTypesService {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  async list(practiceId: string): Promise<AppointmentTypeDto[]> {
    const rows = await this.db
      .select()
      .from(appointmentTypes)
      .where(eq(appointmentTypes.practiceId, practiceId))
      .orderBy(asc(appointmentTypes.sortOrder));
    return rows.map(toDto);
  }

  async create(
    practiceId: string,
    userId: string,
    dto: CreateAppointmentTypeDto,
  ): Promise<AppointmentTypeDto> {
    const existing = await this.list(practiceId);
    const [row] = await this.db
      .insert(appointmentTypes)
      .values({
        id: uuidv7(),
        practiceId,
        ...dto,
        allowedPractitionerKinds: dto.allowedPractitionerKinds ?? ['gp', 'gp_registrar'],
        sortOrder: existing.length,
        createdBy: userId,
      })
      .returning();
    return toDto(row);
  }

  async update(
    practiceId: string,
    typeId: string,
    userId: string,
    dto: UpdateAppointmentTypeDto,
  ): Promise<AppointmentTypeDto> {
    const [row] = await this.db
      .update(appointmentTypes)
      .set({ ...dto, updatedAt: new Date(), updatedBy: userId })
      .where(
        and(eq(appointmentTypes.practiceId, practiceId), eq(appointmentTypes.id, typeId)),
      )
      .returning();
    if (!row) throw new NotFoundException('Appointment type not found');
    return toDto(row);
  }

  /** A type in use is deactivated rather than deleted, so history keeps its meaning. */
  async deactivate(
    practiceId: string,
    typeId: string,
    userId: string,
  ): Promise<AppointmentTypeDto> {
    return this.update(practiceId, typeId, userId, { isActive: false } as UpdateAppointmentTypeDto);
  }

  async listSessions(practiceId: string): Promise<SessionTemplateDto[]> {
    const rows = await this.db
      .select({
        session: sessionTemplates,
        practitioner: practitioners,
        location: practiceLocations,
      })
      .from(sessionTemplates)
      .innerJoin(practitioners, eq(practitioners.id, sessionTemplates.practitionerId))
      .innerJoin(practiceLocations, eq(practiceLocations.id, sessionTemplates.locationId))
      .where(eq(sessionTemplates.practiceId, practiceId));

    return rows.map(({ session, practitioner, location }) => ({
      id: session.id,
      practitionerId: session.practitionerId,
      practitionerName: [practitioner.title, practitioner.givenName, practitioner.familyName]
        .filter(Boolean)
        .join(' '),
      locationId: session.locationId,
      locationName: location.name,
      dayOfWeek: session.dayOfWeek,
      startsAt: session.startsAt.slice(0, 5),
      endsAt: session.endsAt.slice(0, 5),
      slotMinutes: session.slotMinutes,
      onlineBookable: session.onlineBookable,
      isActive: session.isActive,
      slotCount: slotCount(session.startsAt, session.endsAt, session.slotMinutes),
    }));
  }

  async createSession(
    practiceId: string,
    userId: string,
    dto: CreateSessionTemplateDto,
  ): Promise<SessionTemplateDto[]> {
    const slotMinutes = dto.slotMinutes ?? 15;
    const minutes = toMinutes(dto.endsAt) - toMinutes(dto.startsAt);

    if (minutes <= 0) {
      throw new BusinessRuleException(
        'invalid-session-times',
        'The session must end after it starts',
        `${dto.startsAt}–${dto.endsAt} is not a valid session.`,
      );
    }
    if (minutes % slotMinutes !== 0) {
      throw new BusinessRuleException(
        'slot-size-does-not-divide-session',
        'Slot size must divide evenly into the session',
        `A ${minutes}-minute session cannot be divided into ${slotMinutes}-minute slots.`,
      );
    }

    // A session outside opening hours is allowed, but the reason is recorded.
    const [hours] = await this.db
      .select()
      .from(locationBusinessHours)
      .where(
        and(
          eq(locationBusinessHours.locationId, dto.locationId),
          eq(locationBusinessHours.dayOfWeek, dto.dayOfWeek as never),
        ),
      )
      .limit(1);

    const outsideHours =
      hours &&
      (!hours.isOpen ||
        (hours.opensAt && dto.startsAt < hours.opensAt.slice(0, 5)) ||
        (hours.closesAt && dto.endsAt > hours.closesAt.slice(0, 5)));

    if (outsideHours && !dto.outsideOpeningHoursReason) {
      throw new BusinessRuleException(
        'session-outside-opening-hours',
        'This session falls outside the location’s opening hours',
        'Record a reason to schedule availability outside opening hours.',
      );
    }

    await this.db.insert(sessionTemplates).values({
      id: uuidv7(),
      practiceId,
      practitionerId: dto.practitionerId,
      locationId: dto.locationId,
      dayOfWeek: dto.dayOfWeek as never,
      startsAt: dto.startsAt,
      endsAt: dto.endsAt,
      slotMinutes,
      onlineBookable: dto.onlineBookable ?? true,
      outsideOpeningHoursReason: dto.outsideOpeningHoursReason,
      createdBy: userId,
    });

    return this.listSessions(practiceId);
  }

  async deleteSession(practiceId: string, sessionId: string): Promise<SessionTemplateDto[]> {
    await this.db
      .delete(sessionTemplates)
      .where(
        and(eq(sessionTemplates.practiceId, practiceId), eq(sessionTemplates.id, sessionId)),
      );
    return this.listSessions(practiceId);
  }
}

function toDto(row: typeof appointmentTypes.$inferSelect): AppointmentTypeDto {
  return {
    id: row.id,
    name: row.name,
    shortCode: row.shortCode,
    durationMinutes: row.durationMinutes,
    colour: row.colour,
    description: row.description,
    allowedPractitionerKinds: row.allowedPractitionerKinds,
    onlineBookable: row.onlineBookable,
    newPatientsAllowed: row.newPatientsAllowed,
    doubleBookingAllowed: row.doubleBookingAllowed,
    requiresTriagePrompt: row.requiresTriagePrompt,
    minNoticeMinutes: row.minNoticeMinutes,
    maxAdvanceDays: row.maxAdvanceDays,
    defaultMbsItemNumber: row.defaultMbsItemNumber,
    isActive: row.isActive,
    sortOrder: row.sortOrder,
  };
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function slotCount(startsAt: string, endsAt: string, slotMinutes: number): number {
  return Math.floor((toMinutes(endsAt) - toMinutes(startsAt)) / slotMinutes);
}
