import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ENTITY_TYPES,
  ONBOARDING_STEPS,
  PRACTICE_TYPES,
  BILLING_POLICIES,
  ACCREDITATION_STATUSES_PLACEHOLDER,
} from './practices.constants';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreatePracticeDto {
  @ApiProperty({ example: 'Raman Family Medicine Pty Ltd' })
  @IsString()
  @IsNotEmpty()
  legalName: string;

  @ApiProperty({ example: 'Brunswick Family Practice' })
  @IsString()
  @IsNotEmpty()
  tradingName: string;

  @ApiProperty({ enum: ENTITY_TYPES })
  @IsIn(ENTITY_TYPES as unknown as string[])
  entityType: string;

  @ApiPropertyOptional({ enum: PRACTICE_TYPES, default: 'general_practice' })
  @IsOptional()
  @IsIn(PRACTICE_TYPES as unknown as string[])
  practiceType?: string;

  @ApiPropertyOptional({
    example: '51824753556',
    description: 'Validated with the ATO modulus 89 checksum. May be deferred.',
  })
  @IsOptional()
  @IsString()
  abn?: string;

  @ApiPropertyOptional({ example: '004085616' })
  @IsOptional()
  @IsString()
  acn?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contactPhone?: string;
}

export class UpdatePracticeDto {
  @ApiPropertyOptional() @IsOptional() @IsString() legalName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() tradingName?: string;
  @ApiPropertyOptional({ enum: ENTITY_TYPES })
  @IsOptional()
  @IsIn(ENTITY_TYPES as unknown as string[])
  entityType?: string;
  @ApiPropertyOptional({ enum: PRACTICE_TYPES })
  @IsOptional()
  @IsIn(PRACTICE_TYPES as unknown as string[])
  practiceType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() abn?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() acn?: string;
  @ApiPropertyOptional() @IsOptional() @IsEmail() contactEmail?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() contactPhone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() website?: string;
}

export class PracticeDto {
  @ApiProperty() id: string;
  @ApiProperty() legalName: string;
  @ApiProperty() tradingName: string;
  @ApiProperty({ enum: ENTITY_TYPES }) entityType: string;
  @ApiProperty({ enum: PRACTICE_TYPES }) practiceType: string;
  @ApiPropertyOptional({ type: String, nullable: true }) abn: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) acn: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) contactEmail: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) contactPhone: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) website: string | null;
  @ApiProperty({ enum: ['in_progress', 'active', 'suspended', 'closed'] })
  onboardingStatus: string;
  @ApiPropertyOptional({ type: String, nullable: true }) activatedAt: string | null;
  @ApiProperty() createdAt: string;
}

export class UpdateRegistrationsDto {
  @ApiPropertyOptional() @IsOptional() @IsString() prodaOrganisationName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() prodaRaNumber?: string;

  @ApiPropertyOptional({
    enum: ['not_registered', 'registration_in_progress', 'registered'],
    description: 'Gates the chronic condition management items and BBPIP participation.',
  })
  @IsOptional()
  @IsIn(['not_registered', 'registration_in_progress', 'registered'])
  myMedicareStatus?: string;

  @ApiPropertyOptional() @IsOptional() @IsDateString() myMedicareRegisteredOn?: string;

  @ApiPropertyOptional({
    description:
      'Bulk Billing Practice Incentive Program. Requires MyMedicare registration and obliges the practice to bulk bill 100% of eligible services.',
  })
  @IsOptional()
  @IsBoolean()
  bbpipParticipating?: boolean;

  @ApiPropertyOptional() @IsOptional() @IsDateString() bbpipEffectiveFrom?: string;

  @ApiPropertyOptional({ enum: ACCREDITATION_STATUSES_PLACEHOLDER })
  @IsOptional()
  @IsIn(ACCREDITATION_STATUSES_PLACEHOLDER as unknown as string[])
  accreditationStatus?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() accreditingBody?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() accreditationExpiresOn?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() pipParticipating?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() wipParticipating?: boolean;
}

export class PracticeRegistrationsDto {
  @ApiProperty() practiceId: string;
  @ApiPropertyOptional({ type: String, nullable: true }) prodaOrganisationName: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) prodaRaNumber: string | null;
  @ApiProperty() myMedicareStatus: string;
  @ApiPropertyOptional({ type: String, nullable: true }) myMedicareRegisteredOn: string | null;
  @ApiProperty() bbpipParticipating: boolean;
  @ApiPropertyOptional({ type: String, nullable: true }) bbpipEffectiveFrom: string | null;
  @ApiProperty() accreditationStatus: string;
  @ApiPropertyOptional({ type: String, nullable: true }) accreditingBody: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) accreditationExpiresOn: string | null;
  @ApiProperty() pipParticipating: boolean;
  @ApiProperty() wipParticipating: boolean;
}

export class UpdateBillingSettingsDto {
  @ApiPropertyOptional({ enum: BILLING_POLICIES })
  @IsOptional()
  @IsIn(BILLING_POLICIES as unknown as string[])
  billingPolicy?: string;

  @ApiPropertyOptional({
    description: 'Private fee multiplier in basis points. 17500 = 1.75×.',
    example: 17500,
  })
  @IsOptional()
  @IsInt()
  @Min(10000)
  privateFeeMultiplier?: number;

  @ApiPropertyOptional({ description: 'Rounding for generated private fees, in cents.', example: 500 })
  @IsOptional()
  @IsInt()
  privateFeeRoundingCents?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  suggestBulkBillIncentives?: boolean;

  @ApiPropertyOptional({
    type: [String],
    description: 'Cohorts bulk billed under a mixed billing policy.',
  })
  @IsOptional()
  bulkBillCohorts?: string[];
}

export class BillingSettingsDto {
  @ApiProperty() practiceId: string;
  @ApiProperty({ enum: BILLING_POLICIES }) billingPolicy: string;
  @ApiProperty() privateFeeMultiplier: number;
  @ApiProperty() privateFeeRoundingCents: number;
  @ApiProperty() suggestBulkBillIncentives: boolean;
  @ApiProperty({ type: [String] }) bulkBillCohorts: string[];
  @ApiProperty({
    description: 'True when BBPIP participation locks the policy to bulk_bill_all.',
  })
  policyLockedByBbpip: boolean;
}

export class OnboardingStepDto {
  @ApiProperty({ enum: ONBOARDING_STEPS }) step: string;
  @ApiProperty() label: string;
  @ApiProperty() description: string;
  @ApiProperty({ enum: ['not_started', 'in_progress', 'complete', 'skipped'] })
  status: string;
  @ApiPropertyOptional({ type: String, nullable: true }) completedAt: string | null;
}

export class ChecklistItemDto {
  @ApiProperty() key: string;
  @ApiProperty() label: string;
  @ApiProperty() satisfied: boolean;
  @ApiProperty({ description: 'Why this matters, shown next to the item.' })
  rationale: string;
}

export class OnboardingStatusDto {
  @ApiProperty() practiceId: string;
  @ApiProperty({ enum: ['in_progress', 'active', 'suspended', 'closed'] })
  onboardingStatus: string;
  @ApiProperty({ type: [OnboardingStepDto] }) steps: OnboardingStepDto[];
  @ApiProperty({
    type: [ChecklistItemDto],
    description: 'Must all be satisfied before the practice can be activated.',
  })
  required: ChecklistItemDto[];
  @ApiProperty({
    type: [ChecklistItemDto],
    description: 'Recommended before seeing patients, but not blocking.',
  })
  recommended: ChecklistItemDto[];
  @ApiProperty() canActivate: boolean;
  @ApiProperty({ description: 'Percentage of all checklist items satisfied.' })
  completionPercent: number;
}

export class CompleteStepDto {
  @ApiPropertyOptional({ enum: ['complete', 'in_progress', 'skipped'], default: 'complete' })
  @IsOptional()
  @IsIn(['complete', 'in_progress', 'skipped'])
  status?: string;
}
