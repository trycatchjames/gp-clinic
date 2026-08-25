import { relations } from 'drizzle-orm';
import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { id, timestamps } from './_shared';
import {
  invitationStatusEnum,
  membershipStatusEnum,
  practiceRoleEnum,
} from './enums';
import { practices, practiceLocations } from './practice';

/**
 * A person who can sign in. A user is not a practitioner — locums and visiting
 * practitioners are billed under but never log in.
 */
export const users = pgTable(
  'users',
  {
    id: id(),
    email: text('email').notNull(),
    emailVerifiedAt: timestamp('email_verified_at', { withTimezone: true }),
    passwordHash: text('password_hash').notNull(),
    givenName: text('given_name').notNull(),
    familyName: text('family_name').notNull(),
    mobile: text('mobile'),
    isActive: boolean('is_active').default(true).notNull(),
    lastSignInAt: timestamp('last_sign_in_at', { withTimezone: true }),
    ...timestamps,
  },
  (t) => [uniqueIndex('users_email_unique').on(t.email)],
);

/**
 * Membership of a practice, with a role. A user holds one role per practice but may
 * be a member of several practices.
 */
export const practiceMemberships = pgTable(
  'practice_memberships',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    role: practiceRoleEnum('role').notNull(),
    status: membershipStatusEnum('status').default('active').notNull(),
    /** Optional link to a practitioner profile for clinical roles. */
    practitionerId: uuid('practitioner_id'),
    joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow().notNull(),
    removedAt: timestamp('removed_at', { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    uniqueIndex('practice_memberships_unique').on(t.practiceId, t.userId),
    index('practice_memberships_practice_idx').on(t.practiceId),
  ],
);

/** Which locations within the practice a member works at. */
export const memberLocations = pgTable(
  'member_locations',
  {
    id: id(),
    membershipId: uuid('membership_id')
      .notNull()
      .references(() => practiceMemberships.id, { onDelete: 'cascade' }),
    locationId: uuid('location_id')
      .notNull()
      .references(() => practiceLocations.id, { onDelete: 'cascade' }),
    ...timestamps,
  },
  (t) => [uniqueIndex('member_locations_unique').on(t.membershipId, t.locationId)],
);

/**
 * Refresh tokens, stored hashed and rotated on use. Reuse of a consumed token
 * revokes the whole family.
 */
export const sessions = pgTable(
  'sessions',
  {
    id: id(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    familyId: uuid('family_id').notNull(),
    refreshTokenHash: text('refresh_token_hash').notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    consumedAt: timestamp('consumed_at', { withTimezone: true }),
    userAgent: text('user_agent'),
    ipAddress: text('ip_address'),
    ...timestamps,
  },
  (t) => [
    index('sessions_user_idx').on(t.userId),
    index('sessions_family_idx').on(t.familyId),
  ],
);

/** Single-use, 14-day invitations to join a practice. */
export const invitations = pgTable(
  'invitations',
  {
    id: id(),
    practiceId: uuid('practice_id')
      .notNull()
      .references(() => practices.id, { onDelete: 'cascade' }),
    email: text('email').notNull(),
    givenName: text('given_name').notNull(),
    familyName: text('family_name').notNull(),
    role: practiceRoleEnum('role').notNull(),
    practitionerId: uuid('practitioner_id'),
    tokenHash: text('token_hash').notNull(),
    status: invitationStatusEnum('status').default('pending').notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    acceptedAt: timestamp('accepted_at', { withTimezone: true }),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    invitedByUserId: uuid('invited_by_user_id').references(() => users.id),
    ...timestamps,
  },
  (t) => [
    index('invitations_practice_idx').on(t.practiceId),
    index('invitations_email_idx').on(t.email),
  ],
);

export const usersRelations = relations(users, ({ many }) => ({
  memberships: many(practiceMemberships),
  sessions: many(sessions),
}));

export const practiceMembershipsRelations = relations(
  practiceMemberships,
  ({ one, many }) => ({
    practice: one(practices, {
      fields: [practiceMemberships.practiceId],
      references: [practices.id],
    }),
    user: one(users, {
      fields: [practiceMemberships.userId],
      references: [users.id],
    }),
    locations: many(memberLocations),
  }),
);
