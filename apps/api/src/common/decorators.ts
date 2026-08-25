import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import type { PracticeRole } from '@gp/contracts';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  practiceId: string | null;
  role: PracticeRole | null;
  locationIds: string[];
}

export const IS_PUBLIC_KEY = 'isPublic';
/** Marks a route as reachable without an access token. */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const ROLES_KEY = 'roles';
/** Restrict a handler to the given practice roles. */
export const Roles = (...roles: PracticeRole[]) => SetMetadata(ROLES_KEY, roles);

export const AUDIT_KEY = 'audit';
/** Record this handler in the audit log under the given action name. */
export const Audit = (action: string) => SetMetadata(AUDIT_KEY, action);

export const CurrentUser = createParamDecorator(
  (data: keyof AuthenticatedUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUser | undefined;
    return data && user ? user[data] : user;
  },
);
