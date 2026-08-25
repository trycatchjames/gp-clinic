import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from '@node-rs/argon2';
import { createHash, randomBytes } from 'node:crypto';
import { and, eq, isNull } from 'drizzle-orm';
import { DATABASE } from '../../db/database.module';
import type { Database } from '../../db/client';
import {
  invitations,
  memberLocations,
  practiceMemberships,
  practices,
  sessions,
  users,
} from '../../db/schema';
import { uuidv7 } from '../../db/uuid';
import { env } from '../../config/env';
import { AuditService } from '../../common/audit.service';
import type {
  AcceptInvitationDto,
  AuthTokensDto,
  LoginDto,
  RegisterDto,
  SessionUserDto,
} from './auth.dto';

const ACCESS_TTL_SECONDS = 15 * 60;
const REFRESH_TTL_DAYS = 30;

@Injectable()
export class AuthService {
  constructor(
    @Inject(DATABASE) private readonly db: Database,
    private readonly jwt: JwtService,
    private readonly audit: AuditService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthTokensDto> {
    const email = dto.email.toLowerCase().trim();
    const [existing] = await this.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (existing) throw new ConflictException('An account with that email already exists');

    const [user] = await this.db
      .insert(users)
      .values({
        id: uuidv7(),
        email,
        passwordHash: await hash(dto.password),
        givenName: dto.givenName.trim(),
        familyName: dto.familyName.trim(),
        mobile: dto.mobile,
        // The prototype trusts the address; a real deployment sends a verification link.
        emailVerifiedAt: new Date(),
      })
      .returning();

    await this.audit.record({ actorUserId: user.id, action: 'auth.register' });
    return this.issueTokens(user.id);
  }

  async login(dto: LoginDto): Promise<AuthTokensDto> {
    const email = dto.email.toLowerCase().trim();
    const [user] = await this.db.select().from(users).where(eq(users.email, email)).limit(1);

    // Same message either way — never confirm whether an address is registered.
    if (!user || !user.isActive) throw new UnauthorizedException('Invalid email or password');
    const ok = await verify(user.passwordHash, dto.password).catch(() => false);
    if (!ok) throw new UnauthorizedException('Invalid email or password');

    await this.db
      .update(users)
      .set({ lastSignInAt: new Date() })
      .where(eq(users.id, user.id));
    await this.audit.record({ actorUserId: user.id, action: 'auth.login' });

    return this.issueTokens(user.id);
  }

  /**
   * Refresh tokens rotate on use. Presenting a token that has already been
   * consumed revokes the whole family — that is the reuse-detection signal.
   */
  async refresh(refreshToken: string): Promise<AuthTokensDto> {
    let payload: { sub: string; sid: string };
    try {
      payload = await this.jwt.verifyAsync(refreshToken, { secret: env.jwt.refreshSecret });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const [session] = await this.db
      .select()
      .from(sessions)
      .where(eq(sessions.id, payload.sid))
      .limit(1);

    if (!session || session.revokedAt) throw new UnauthorizedException('Session revoked');

    if (session.consumedAt) {
      await this.db
        .update(sessions)
        .set({ revokedAt: new Date() })
        .where(eq(sessions.familyId, session.familyId));
      await this.audit.record({
        actorUserId: session.userId,
        action: 'auth.refresh_token_reuse_detected',
        context: { familyId: session.familyId },
      });
      throw new UnauthorizedException('Refresh token reuse detected — please sign in again');
    }

    const presented = createHash('sha256').update(refreshToken).digest('hex');
    if (presented !== session.refreshTokenHash) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.db
      .update(sessions)
      .set({ consumedAt: new Date() })
      .where(eq(sessions.id, session.id));

    return this.issueTokens(session.userId, session.familyId);
  }

  async logout(userId: string): Promise<void> {
    await this.db
      .update(sessions)
      .set({ revokedAt: new Date() })
      .where(and(eq(sessions.userId, userId), isNull(sessions.revokedAt)));
    await this.audit.record({ actorUserId: userId, action: 'auth.logout' });
  }

  async acceptInvitation(dto: AcceptInvitationDto): Promise<AuthTokensDto> {
    const tokenHash = createHash('sha256').update(dto.token).digest('hex');
    const [invitation] = await this.db
      .select()
      .from(invitations)
      .where(eq(invitations.tokenHash, tokenHash))
      .limit(1);

    if (!invitation || invitation.status !== 'pending') {
      throw new NotFoundException('This invitation is no longer valid');
    }
    if (invitation.expiresAt < new Date()) {
      await this.db
        .update(invitations)
        .set({ status: 'expired' })
        .where(eq(invitations.id, invitation.id));
      throw new UnauthorizedException('This invitation has expired');
    }

    const email = invitation.email.toLowerCase();
    let [user] = await this.db.select().from(users).where(eq(users.email, email)).limit(1);

    if (!user) {
      [user] = await this.db
        .insert(users)
        .values({
          id: uuidv7(),
          email,
          passwordHash: await hash(dto.password),
          givenName: invitation.givenName,
          familyName: invitation.familyName,
          emailVerifiedAt: new Date(),
        })
        .returning();
    }

    await this.db
      .insert(practiceMemberships)
      .values({
        id: uuidv7(),
        practiceId: invitation.practiceId,
        userId: user.id,
        role: invitation.role,
        practitionerId: invitation.practitionerId,
      })
      .onConflictDoNothing();

    await this.db
      .update(invitations)
      .set({ status: 'accepted', acceptedAt: new Date() })
      .where(eq(invitations.id, invitation.id));

    await this.audit.record({
      practiceId: invitation.practiceId,
      actorUserId: user.id,
      action: 'auth.invitation_accepted',
      entityType: 'Invitation',
      entityId: invitation.id,
    });

    return this.issueTokens(user.id);
  }

  async currentUser(userId: string): Promise<SessionUserDto> {
    const [user] = await this.db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) throw new UnauthorizedException();
    return this.buildSessionUser(user);
  }

  /**
   * Token issuance is isolated here so that swapping in an external identity
   * provider later touches one method.
   */
  private async issueTokens(userId: string, familyId?: string): Promise<AuthTokensDto> {
    const [user] = await this.db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) throw new UnauthorizedException();

    const sessionUser = await this.buildSessionUser(user);
    const sessionId = uuidv7();
    const refreshToken = await this.jwt.signAsync(
      { sub: userId, sid: sessionId },
      { secret: env.jwt.refreshSecret, expiresIn: `${REFRESH_TTL_DAYS}d` },
    );

    await this.db.insert(sessions).values({
      id: sessionId,
      userId,
      familyId: familyId ?? uuidv7(),
      refreshTokenHash: createHash('sha256').update(refreshToken).digest('hex'),
      expiresAt: new Date(Date.now() + REFRESH_TTL_DAYS * 86400_000),
    });

    const accessToken = await this.jwt.signAsync(
      {
        sub: userId,
        email: user.email,
        practiceId: sessionUser.practiceId,
        role: sessionUser.role,
        locationIds: sessionUser.locationIds,
      },
      { secret: env.jwt.accessSecret, expiresIn: `${ACCESS_TTL_SECONDS}s` },
    );

    return { accessToken, refreshToken, expiresIn: ACCESS_TTL_SECONDS, user: sessionUser };
  }

  private async buildSessionUser(user: typeof users.$inferSelect): Promise<SessionUserDto> {
    const [membership] = await this.db
      .select({
        practiceId: practiceMemberships.practiceId,
        role: practiceMemberships.role,
        membershipId: practiceMemberships.id,
        practitionerId: practiceMemberships.practitionerId,
        practiceName: practices.tradingName,
        onboardingStatus: practices.onboardingStatus,
      })
      .from(practiceMemberships)
      .innerJoin(practices, eq(practices.id, practiceMemberships.practiceId))
      .where(
        and(eq(practiceMemberships.userId, user.id), eq(practiceMemberships.status, 'active')),
      )
      .limit(1);

    const locationIds = membership
      ? (
          await this.db
            .select({ locationId: memberLocations.locationId })
            .from(memberLocations)
            .where(eq(memberLocations.membershipId, membership.membershipId))
        ).map((row) => row.locationId)
      : [];

    return {
      id: user.id,
      email: user.email,
      givenName: user.givenName,
      familyName: user.familyName,
      practiceId: membership?.practiceId ?? null,
      practiceName: membership?.practiceName ?? null,
      role: membership?.role ?? null,
      practitionerId: membership?.practitionerId ?? null,
      locationIds,
      onboardingStatus: membership?.onboardingStatus ?? null,
    };
  }

  static generateInvitationToken(): { token: string; tokenHash: string } {
    const token = randomBytes(32).toString('base64url');
    return { token, tokenHash: createHash('sha256').update(token).digest('hex') };
  }
}
