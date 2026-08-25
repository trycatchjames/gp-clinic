import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { PracticeRole } from '@gp/contracts';
import { ROLES_KEY, type AuthenticatedUser } from '../decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<PracticeRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required?.length) return true;

    const user = context.switchToHttp().getRequest().user as AuthenticatedUser | undefined;
    if (!user?.role || !required.includes(user.role)) {
      throw new ForbiddenException(
        `This action requires one of: ${required.join(', ')}`,
      );
    }
    return true;
  }
}
