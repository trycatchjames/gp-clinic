import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { tap } from 'rxjs';
import { AuditService } from '../audit.service';
import { AUDIT_KEY, type AuthenticatedUser } from '../decorators';

/**
 * Records every mutating request, plus any handler explicitly marked with @Audit
 * (used for clinical record *views*, which must be logged as well as edits).
 */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(
    private readonly audit: AuditService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const explicitAction = this.reflector.get<string>(AUDIT_KEY, context.getHandler());
    const isMutation = ['POST', 'PATCH', 'PUT', 'DELETE'].includes(request.method);

    if (!explicitAction && !isMutation) return next.handle();

    const user = request.user as AuthenticatedUser | undefined;
    const action = explicitAction ?? `${request.method} ${request.route?.path ?? request.url}`;

    return next.handle().pipe(
      tap({
        next: () => {
          // Fire and forget, but never let a logging failure take down a request.
          void this.audit
            .record({
              practiceId: user?.practiceId ?? request.params?.practiceId ?? null,
              actorUserId: user?.userId ?? null,
              patientId: request.params?.patientId ?? null,
              action,
              entityType: context.getClass().name.replace('Controller', ''),
              entityId: request.params?.id,
              ipAddress: request.ip,
              userAgent: request.headers['user-agent'],
              context: { method: request.method, path: request.originalUrl },
            })
            .catch((error) => this.logger.warn(`Audit write failed: ${error}`));
        },
      }),
    );
  }
}
