import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, eq, gt, isNull } from 'drizzle-orm';
import {
  CLINICAL_ROLES,
  ROLE_LABELS,
  type PracticeRole,
} from '@gp/contracts';
import { DATABASE } from '../../db/database.module';
import type { Database } from '../../db/client';
import {
  appointments,
  invitations,
  practiceMemberships,
  practitioners,
  recalls,
  results,
  sessions,
  users,
} from '../../db/schema';
import { uuidv7 } from '../../db/uuid';
import { AuditService } from '../../common/audit.service';
import { BusinessRuleException } from '../../common/problem-details';
import { AuthService } from '../auth/auth.service';
import { env } from '../../config/env';
import type {
  InvitationDto,
  InviteMemberDto,
  MemberDto,
  OffboardingChecklistDto,
  UpdateMemberRoleDto,
} from './team.dto';

const INVITATION_TTL_DAYS = 14;

@Injectable()
export class TeamService {
  constructor(
    @Inject(DATABASE) private readonly db: Database,
    private readonly audit: AuditService,
  ) {}

  async listMembers(practiceId: string): Promise<MemberDto[]> {
    const rows = await this.db
      .select({ membership: practiceMemberships, user: users })
      .from(practiceMemberships)
      .innerJoin(users, eq(users.id, practiceMemberships.userId))
      .where(eq(practiceMemberships.practiceId, practiceId));

    return rows.map(({ membership, user }) => ({
      id: membership.id,
      userId: user.id,
      email: user.email,
      givenName: user.givenName,
      familyName: user.familyName,
      role: membership.role,
      roleLabel: ROLE_LABELS[membership.role as PracticeRole],
      status: membership.status,
      practitionerId: membership.practitionerId,
      joinedAt: membership.joinedAt.toISOString(),
      lastSignInAt: user.lastSignInAt?.toISOString() ?? null,
    }));
  }

  async invite(
    practiceId: string,
    userId: string,
    dto: InviteMemberDto,
  ): Promise<InvitationDto> {
    const email = dto.email.toLowerCase().trim();

    const [existing] = await this.db
      .select({ id: practiceMemberships.id })
      .from(practiceMemberships)
      .innerJoin(users, eq(users.id, practiceMemberships.userId))
      .where(and(eq(practiceMemberships.practiceId, practiceId), eq(users.email, email)))
      .limit(1);
    if (existing) throw new ConflictException('That person is already a member of this practice');

    // Clinical roles must be linked to a practitioner profile.
    if (CLINICAL_ROLES.includes(dto.role as PracticeRole) && !dto.practitionerId) {
      throw new BusinessRuleException(
        'clinical-role-requires-practitioner',
        'A clinical role needs a practitioner profile',
        'Link an existing practitioner profile or create one before sending this invitation.',
      );
    }

    if (dto.practitionerId) {
      const [practitioner] = await this.db
        .select({ id: practitioners.id })
        .from(practitioners)
        .where(
          and(
            eq(practitioners.practiceId, practiceId),
            eq(practitioners.id, dto.practitionerId),
          ),
        )
        .limit(1);
      if (!practitioner) throw new NotFoundException('Practitioner not found');
    }

    const { token, tokenHash } = AuthService.generateInvitationToken();
    const [invitation] = await this.db
      .insert(invitations)
      .values({
        id: uuidv7(),
        practiceId,
        email,
        givenName: dto.givenName.trim(),
        familyName: dto.familyName.trim(),
        role: dto.role as never,
        practitionerId: dto.practitionerId,
        tokenHash,
        expiresAt: new Date(Date.now() + INVITATION_TTL_DAYS * 86400_000),
        invitedByUserId: userId,
      })
      .returning();

    await this.audit.record({
      practiceId,
      actorUserId: userId,
      action: 'team.invited',
      entityType: 'Invitation',
      entityId: invitation.id,
      context: { email, role: dto.role },
    });

    return {
      ...toInvitationDto(invitation),
      // No email delivery in the prototype — the link is returned once, here.
      acceptUrl: `${env.webOrigin}/accept-invitation?token=${token}`,
    };
  }

  async listInvitations(practiceId: string): Promise<InvitationDto[]> {
    const rows = await this.db
      .select()
      .from(invitations)
      .where(eq(invitations.practiceId, practiceId));
    return rows.map((row) => ({ ...toInvitationDto(row), acceptUrl: null }));
  }

  async revokeInvitation(
    practiceId: string,
    invitationId: string,
    userId: string,
  ): Promise<void> {
    const [row] = await this.db
      .update(invitations)
      .set({ status: 'revoked', revokedAt: new Date() })
      .where(and(eq(invitations.practiceId, practiceId), eq(invitations.id, invitationId)))
      .returning();
    if (!row) throw new NotFoundException('Invitation not found');

    await this.audit.record({
      practiceId,
      actorUserId: userId,
      action: 'team.invitation_revoked',
      entityType: 'Invitation',
      entityId: invitationId,
    });
  }

  async updateRole(
    practiceId: string,
    memberId: string,
    actorUserId: string,
    dto: UpdateMemberRoleDto,
  ): Promise<MemberDto> {
    const [member] = await this.db
      .select()
      .from(practiceMemberships)
      .where(
        and(
          eq(practiceMemberships.practiceId, practiceId),
          eq(practiceMemberships.id, memberId),
        ),
      )
      .limit(1);
    if (!member) throw new NotFoundException('Member not found');

    // A practice must always have at least one active owner.
    if (member.role === 'practice_owner' && dto.role !== 'practice_owner') {
      await this.assertNotLastOwner(practiceId, memberId);
    }

    await this.db
      .update(practiceMemberships)
      .set({ role: dto.role as never, updatedAt: new Date(), updatedBy: actorUserId })
      .where(eq(practiceMemberships.id, memberId));

    await this.audit.record({
      practiceId,
      actorUserId,
      action: 'team.role_changed',
      entityType: 'PracticeMembership',
      entityId: memberId,
      context: { from: member.role, to: dto.role },
    });

    const members = await this.listMembers(practiceId);
    return members.find((m) => m.id === memberId)!;
  }

  /**
   * Offboarding surfaces what needs a new owner before access is removed. Unactioned
   * results and open recalls are blocking — an orphaned result is a safety event.
   */
  async getOffboardingChecklist(
    practiceId: string,
    memberId: string,
  ): Promise<OffboardingChecklistDto> {
    const [member] = await this.db
      .select({ membership: practiceMemberships, user: users })
      .from(practiceMemberships)
      .innerJoin(users, eq(users.id, practiceMemberships.userId))
      .where(
        and(
          eq(practiceMemberships.practiceId, practiceId),
          eq(practiceMemberships.id, memberId),
        ),
      )
      .limit(1);
    if (!member) throw new NotFoundException('Member not found');

    const practitionerId = member.membership.practitionerId;

    const [futureAppointments, unactionedResults, openRecalls, usualGpPatients] =
      practitionerId
        ? await Promise.all([
            this.db
              .select({ id: appointments.id })
              .from(appointments)
              .where(
                and(
                  eq(appointments.practitionerId, practitionerId),
                  gt(appointments.startsAt, new Date()),
                  eq(appointments.status, 'booked'),
                ),
              ),
            this.db
              .select({ id: results.id })
              .from(results)
              .where(
                and(
                  eq(results.orderingPractitionerId, practitionerId),
                  isNull(results.actionedAt),
                ),
              ),
            this.db
              .select({ id: recalls.id })
              .from(recalls)
              .where(
                and(
                  eq(recalls.responsiblePractitionerId, practitionerId),
                  eq(recalls.status, 'open'),
                ),
              ),
            this.db
              .select({ id: practitioners.id })
              .from(practitioners)
              .where(eq(practitioners.id, practitionerId)),
          ])
        : [[], [], [], []];

    const items = [
      {
        key: 'future_appointments',
        label: 'Reassign or cancel future appointments',
        count: futureAppointments.length,
        blocking: false,
        resolved: futureAppointments.length === 0,
      },
      {
        key: 'unactioned_results',
        label: 'Reassign unactioned results to a named practitioner',
        count: unactionedResults.length,
        blocking: true,
        resolved: unactionedResults.length === 0,
      },
      {
        key: 'open_recalls',
        label: 'Reassign open recalls',
        count: openRecalls.length,
        blocking: true,
        resolved: openRecalls.length === 0,
      },
      {
        key: 'usual_gp_patients',
        label: 'Reassign patients who have them recorded as usual GP',
        count: usualGpPatients.length,
        blocking: false,
        resolved: usualGpPatients.length === 0,
      },
    ];

    return {
      memberId,
      displayName: `${member.user.givenName} ${member.user.familyName}`,
      items,
      canComplete: items.filter((i) => i.blocking).every((i) => i.resolved),
    };
  }

  async removeMember(
    practiceId: string,
    memberId: string,
    actorUserId: string,
  ): Promise<void> {
    const checklist = await this.getOffboardingChecklist(practiceId, memberId);
    if (!checklist.canComplete) {
      const blocking = checklist.items.filter((i) => i.blocking && !i.resolved);
      throw new BusinessRuleException(
        'offboarding-blocked',
        'This person still owns clinical work',
        blocking.map((i) => `${i.count} × ${i.label}`).join('; '),
      );
    }

    await this.assertNotLastOwner(practiceId, memberId);

    const [member] = await this.db
      .update(practiceMemberships)
      .set({ status: 'removed', removedAt: new Date(), updatedBy: actorUserId })
      .where(
        and(
          eq(practiceMemberships.practiceId, practiceId),
          eq(practiceMemberships.id, memberId),
        ),
      )
      .returning();
    if (!member) throw new NotFoundException('Member not found');

    // Access ends immediately; their authored records are untouched.
    await this.db
      .update(sessions)
      .set({ revokedAt: new Date() })
      .where(and(eq(sessions.userId, member.userId), isNull(sessions.revokedAt)));

    await this.audit.record({
      practiceId,
      actorUserId,
      action: 'team.member_removed',
      entityType: 'PracticeMembership',
      entityId: memberId,
    });
  }

  private async assertNotLastOwner(practiceId: string, memberId: string): Promise<void> {
    const owners = await this.db
      .select({ id: practiceMemberships.id })
      .from(practiceMemberships)
      .where(
        and(
          eq(practiceMemberships.practiceId, practiceId),
          eq(practiceMemberships.role, 'practice_owner'),
          eq(practiceMemberships.status, 'active'),
        ),
      );
    if (owners.length <= 1 && owners.some((o) => o.id === memberId)) {
      throw new BusinessRuleException(
        'last-practice-owner',
        'The practice must have at least one active owner',
        'Make someone else a practice owner before changing or removing this one.',
      );
    }
  }
}

function toInvitationDto(row: typeof invitations.$inferSelect): InvitationDto {
  return {
    id: row.id,
    email: row.email,
    givenName: row.givenName,
    familyName: row.familyName,
    role: row.role,
    roleLabel: ROLE_LABELS[row.role as PracticeRole],
    status: row.expiresAt < new Date() && row.status === 'pending' ? 'expired' : row.status,
    expiresAt: row.expiresAt.toISOString(),
    createdAt: row.createdAt.toISOString(),
  };
}
