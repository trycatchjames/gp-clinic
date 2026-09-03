import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { CommonModule } from './common/common.module';
import { ProblemDetailsFilter } from './common/filters/problem-details.filter';
import { AuthGuard } from './common/guards/auth.guard';
import { PermissionsGuard } from './common/guards/permissions.guard';
import { PracticeScopeGuard } from './common/guards/practice-scope.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';
import { IdempotencyInterceptor } from './common/interceptors/idempotency.interceptor';
import { DatabaseModule } from './db/database.module';
import { AppointmentTypesModule } from './modules/appointment-types/appointment-types.module';
import { AuthModule } from './modules/auth/auth.module';
import { BillingModule } from './modules/billing/billing.module';
import { HealthModule } from './modules/health/health.module';
import { LocationsModule } from './modules/locations/locations.module';
import { PatientsModule } from './modules/patients/patients.module';
import { PracticesModule } from './modules/practices/practices.module';
import { PractitionersModule } from './modules/practitioners/practitioners.module';
import { TeamModule } from './modules/team/team.module';

@Module({
  imports: [
    DatabaseModule,
    CommonModule,
    AuthModule,
    HealthModule,
    PracticesModule,
    LocationsModule,
    PractitionersModule,
    TeamModule,
    AppointmentTypesModule,
    BillingModule,
    PatientsModule,
  ],
  providers: [
    // Order matters: authenticate, then resolve the tenant, then check the role,
    // then check the granular permission.
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: PracticeScopeGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },
    { provide: APP_INTERCEPTOR, useClass: IdempotencyInterceptor },
    { provide: APP_INTERCEPTOR, useClass: AuditInterceptor },
    { provide: APP_FILTER, useClass: ProblemDetailsFilter },
  ],
})
export class AppModule {}
