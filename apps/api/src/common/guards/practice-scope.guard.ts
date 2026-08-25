import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { AuthenticatedUser } from '../decorators';

/**
 * The tenancy boundary. If a route carries :practiceId it must match the practice
 * on the caller's token. A mismatch returns 404 rather than 403 — confirming that a
 * practice exists is itself a disclosure.
 */
@Injectable()
export class PracticeScopeGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUser | undefined;
    const practiceId: string | undefined = request.params?.practiceId;

    if (!practiceId) return true;
    if (!user?.practiceId || user.practiceId !== practiceId) {
      throw new NotFoundException('Practice not found');
    }
    return true;
  }
}
