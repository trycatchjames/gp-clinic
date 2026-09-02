import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule, type OpenAPIObject } from '@nestjs/swagger';

/**
 * The API documents itself from the same decorators that validate it, so a DTO
 * cannot describe a field it does not enforce.
 */
export function buildOpenApiDocument(app: INestApplication): OpenAPIObject {
  const config = new DocumentBuilder()
    .setTitle('GP Practice Management API')
    .setDescription(
      [
        'Practice management for Australian general practice — scheduling, patient',
        'management, the clinical record, and billing.',
        '',
        'Conventions:',
        '- Errors are RFC 9457 problem details.',
        '- Every mutating endpoint accepts an `Idempotency-Key` header, which is what',
        '  makes the offline outbox safe to replay.',
        '- Every route below `/practices/{practiceId}` is scoped to the practice on the',
        '  caller’s access token. A mismatch returns 404.',
        '',
        'Authoritative product behaviour, domain rules, and executable acceptance examples',
        'live under `spec/`.',
      ].join('\n'),
    )
    .setVersion('0.1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'bearer',
    )
    .addTag('Auth', 'Accounts, sessions and invitations')
    .addTag('Practices', 'Practice identity, registrations, billing policy and onboarding')
    .addTag('Locations', 'Sites, opening hours and after-hours arrangements')
    .addTag('Practitioners', 'Credentials, provider numbers and supervision')
    .addTag('Team', 'Members, roles and invitations')
    .addTag('Appointment types', 'What can be booked and practitioner availability')
    .addTag('Billing', 'Fee schedules and the MBS reference catalogue')
    .addTag('Health', 'Liveness')
    .build();

  return SwaggerModule.createDocument(app, config, { deepScanRoutes: true });
}
