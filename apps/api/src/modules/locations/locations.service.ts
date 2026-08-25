import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, asc, eq, gt } from 'drizzle-orm';
import { DATABASE } from '../../db/database.module';
import type { Database } from '../../db/client';
import {
  appointments,
  locationBusinessHours,
  practiceLocations,
} from '../../db/schema';
import { uuidv7 } from '../../db/uuid';
import { AuditService } from '../../common/audit.service';
import { BusinessRuleException } from '../../common/problem-details';
import type {
  BusinessHoursDayDto,
  CreateLocationDto,
  LocationDto,
  SetBusinessHoursDto,
  UpdateLocationDto,
} from './locations.dto';

@Injectable()
export class LocationsService {
  constructor(
    @Inject(DATABASE) private readonly db: Database,
    private readonly audit: AuditService,
  ) {}

  async list(practiceId: string): Promise<LocationDto[]> {
    const rows = await this.db
      .select()
      .from(practiceLocations)
      .where(eq(practiceLocations.practiceId, practiceId))
      .orderBy(asc(practiceLocations.createdAt));
    return rows.map(toLocationDto);
  }

  async findOne(practiceId: string, locationId: string): Promise<LocationDto> {
    const [row] = await this.db
      .select()
      .from(practiceLocations)
      .where(
        and(
          eq(practiceLocations.practiceId, practiceId),
          eq(practiceLocations.id, locationId),
        ),
      )
      .limit(1);
    if (!row) throw new NotFoundException('Location not found');
    return toLocationDto(row);
  }

  async create(
    practiceId: string,
    userId: string,
    dto: CreateLocationDto,
  ): Promise<LocationDto> {
    const existing = await this.list(practiceId);
    const isPrimary = dto.isPrimary ?? existing.length === 0;

    if (isPrimary && existing.length) {
      await this.db
        .update(practiceLocations)
        .set({ isPrimary: false })
        .where(eq(practiceLocations.practiceId, practiceId));
    }

    const [row] = await this.db
      .insert(practiceLocations)
      .values({
        id: uuidv7(),
        practiceId,
        ...dto,
        state: dto.state as never,
        isPrimary,
        createdBy: userId,
      })
      .returning();

    await this.audit.record({
      practiceId,
      actorUserId: userId,
      action: 'location.created',
      entityType: 'PracticeLocation',
      entityId: row.id,
    });

    return toLocationDto(row);
  }

  async update(
    practiceId: string,
    locationId: string,
    userId: string,
    dto: UpdateLocationDto,
  ): Promise<LocationDto> {
    // Deactivating a location requires its future appointments to be resolved first.
    if (dto.isActive === false) {
      const future = await this.db
        .select({ id: appointments.id })
        .from(appointments)
        .where(
          and(
            eq(appointments.locationId, locationId),
            gt(appointments.startsAt, new Date()),
            eq(appointments.status, 'booked'),
          ),
        );
      if (future.length) {
        throw new BusinessRuleException(
          'location-has-future-appointments',
          'This location still has future appointments',
          `${future.length} appointment(s) must be rebooked or cancelled before this location can be deactivated.`,
        );
      }
    }

    const [row] = await this.db
      .update(practiceLocations)
      .set({
        ...dto,
        state: dto.state as never,
        afterHoursArrangement: dto.afterHoursArrangement as never,
        updatedAt: new Date(),
        updatedBy: userId,
      })
      .where(
        and(
          eq(practiceLocations.practiceId, practiceId),
          eq(practiceLocations.id, locationId),
        ),
      )
      .returning();
    if (!row) throw new NotFoundException('Location not found');

    await this.audit.record({
      practiceId,
      actorUserId: userId,
      action: 'location.updated',
      entityType: 'PracticeLocation',
      entityId: locationId,
    });

    return toLocationDto(row);
  }

  async getBusinessHours(
    practiceId: string,
    locationId: string,
  ): Promise<BusinessHoursDayDto[]> {
    const rows = await this.db
      .select()
      .from(locationBusinessHours)
      .where(
        and(
          eq(locationBusinessHours.practiceId, practiceId),
          eq(locationBusinessHours.locationId, locationId),
        ),
      );
    return rows.map((row) => ({
      dayOfWeek: row.dayOfWeek,
      isOpen: row.isOpen,
      opensAt: row.opensAt ?? undefined,
      closesAt: row.closesAt ?? undefined,
      breakStartsAt: row.breakStartsAt ?? undefined,
      breakEndsAt: row.breakEndsAt ?? undefined,
    }));
  }

  async setBusinessHours(
    practiceId: string,
    locationId: string,
    userId: string,
    dto: SetBusinessHoursDto,
  ): Promise<BusinessHoursDayDto[]> {
    for (const day of dto.days) {
      if (day.isOpen && (!day.opensAt || !day.closesAt)) {
        throw new BusinessRuleException(
          'incomplete-opening-hours',
          'Opening hours are incomplete',
          `${day.dayOfWeek} is marked open but has no opening or closing time.`,
        );
      }
      if (day.isOpen && day.opensAt && day.closesAt && day.opensAt >= day.closesAt) {
        throw new BusinessRuleException(
          'invalid-opening-hours',
          'Closing time must be after opening time',
          `${day.dayOfWeek} closes at or before it opens.`,
        );
      }
    }

    await this.db
      .delete(locationBusinessHours)
      .where(
        and(
          eq(locationBusinessHours.practiceId, practiceId),
          eq(locationBusinessHours.locationId, locationId),
        ),
      );

    if (dto.days.length) {
      await this.db.insert(locationBusinessHours).values(
        dto.days.map((day) => ({
          id: uuidv7(),
          practiceId,
          locationId,
          dayOfWeek: day.dayOfWeek as never,
          isOpen: day.isOpen,
          opensAt: day.isOpen ? day.opensAt : null,
          closesAt: day.isOpen ? day.closesAt : null,
          breakStartsAt: day.breakStartsAt ?? null,
          breakEndsAt: day.breakEndsAt ?? null,
          createdBy: userId,
        })),
      );
    }

    return this.getBusinessHours(practiceId, locationId);
  }
}

function toLocationDto(row: typeof practiceLocations.$inferSelect): LocationDto {
  return {
    id: row.id,
    practiceId: row.practiceId,
    name: row.name,
    isPrimary: row.isPrimary,
    isActive: row.isActive,
    streetAddress: row.streetAddress,
    suburb: row.suburb,
    state: row.state,
    postcode: row.postcode,
    timezone: row.timezone,
    postalAddress: row.postalAddress,
    phone: row.phone,
    afterHoursPhone: row.afterHoursPhone,
    fax: row.fax,
    email: row.email,
    hpiO: row.hpiO,
    medicareMinorId: row.medicareMinorId,
    afterHoursArrangement: row.afterHoursArrangement,
    afterHoursProviderName: row.afterHoursProviderName,
    afterHoursContact: row.afterHoursContact,
    wheelchairAccess: row.wheelchairAccess,
    accessibleToilet: row.accessibleToilet,
    hearingLoop: row.hearingLoop,
    onSiteParking: row.onSiteParking,
    publicTransportNearby: row.publicTransportNearby,
    treatmentRoom: row.treatmentRoom,
    procedureRoom: row.procedureRoom,
    onSitePathologyCollection: row.onSitePathologyCollection,
  };
}
