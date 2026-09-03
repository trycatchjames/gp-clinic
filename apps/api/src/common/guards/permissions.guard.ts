import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { hasPermission, type Permission } from '@gp/contracts';
import { PERMISSIONS_KEY, type AuthenticatedUser } from '../decorators';

/**
 * Enforces the granular permission catalogue. This is the pattern to extend —
 * `RolesGuard` remains only for endpoints migrated before this guard existed.
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<Permission[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required?.length) return true;

    const user = context.switchToHttp().getRequest().user as AuthenticatedUser | undefined;
    const missing = required.filter((permission) => !hasPermission(user?.role, permission));
    if (missing.length) {
      throw new ForbiddenException(`This action requires: ${missing.join(', ')}`);
    }
    return true;
  }
}
