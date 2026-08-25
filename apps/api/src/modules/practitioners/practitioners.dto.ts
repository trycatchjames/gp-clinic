import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  AHPRA_REGISTRATION_TYPES,
  PRACTITIONER_KINDS,
  QUALIFICATION_TYPES,
  SUPERVISION_LEVELS,
  TRAINING_TERMS,
} from '@gp/contracts';
import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreatePractitionerDto {
  @ApiPropertyOptional({ example: 'Dr' }) @IsOptional() @IsString() title?: string;
  @ApiProperty({ example: 'Tom' }) @IsString() @IsNotEmpty() givenName: string;
  @ApiProperty({ example: 'Nguyen' }) @IsString() @IsNotEmpty() familyName: string;
  @ApiPropertyOptional() @IsOptional() @IsString() preferredName?: string;

  @ApiPropertyOptional({
    description: 'Recorded because some patients require a practitioner of a particular gender.',
  })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({ enum: PRACTITIONER_KINDS })
  @IsIn(PRACTITIONER_KINDS as unknown as string[])
  kind: string;

  @ApiPropertyOptional() @IsOptional() @IsString() email?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mobile?: string;

  @ApiPropertyOptional({ example: 'MED0001234567' })
  @IsOptional()
  @IsString()
  ahpraRegistrationNumber?: string;

  @ApiPropertyOptional({ enum: AHPRA_REGISTRATION_TYPES })
  @IsOptional()
  @IsIn(AHPRA_REGISTRATION_TYPES as unknown as string[])
  ahpraRegistrationType?: string;

  @ApiPropertyOptional() @IsOptional() @IsDateString() ahpraExpiresOn?: string;

  @ApiPropertyOptional({ description: 'Healthcare Provider Identifier — Individual' })
  @IsOptional()
  @IsString()
  hpiI?: string;

  @ApiPropertyOptional({ description: 'PBS prescriber number' })
  @IsOptional()
  @IsString()
  prescriberNumber?: string;

  @ApiPropertyOptional({ description: 'Specialist recognition. Gates the higher MBS fee tier.' })
  @IsOptional()
  @IsBoolean()
  vocationalRegistration?: boolean;

  @ApiPropertyOptional({
    description:
      'GPMHSC-accredited Mental Health Skills Training. Gates MBS items 2715 and 2717.',
  })
  @IsOptional()
  @IsBoolean()
  mentalHealthSkillsTraining?: boolean;

  @ApiPropertyOptional({ description: 'Whether this practitioner may supervise registrars.' })
  @IsOptional()
  @IsBoolean()
  isSupervisor?: boolean;
}

export class UpdatePractitionerDto extends CreatePractitionerDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() indemnityInsurer?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() indemnityPolicyNumber?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() indemnityExpiresOn?: string;
}

export class ProviderNumberDto {
  @ApiProperty() locationId: string;
  @ApiProperty() locationName: string;
  @ApiPropertyOptional({ type: String, nullable: true }) providerNumber: string | null;
  @ApiProperty() isActive: boolean;
}

export class SetProviderNumberDto {
  @ApiProperty() @IsUUID() locationId: string;
  @ApiPropertyOptional({
    example: '2143567A',
    description: 'Medicare provider numbers are issued per practitioner per location.',
  })
  @IsOptional()
  @IsString()
  providerNumber?: string;
}

export class QualificationDto {
  @ApiProperty() id: string;
  @ApiProperty({ enum: QUALIFICATION_TYPES }) qualificationType: string;
  @ApiProperty() label: string;
  @ApiPropertyOptional({ type: String, nullable: true }) description: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) issuingBody: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) obtainedOn: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) expiresOn: string | null;
  @ApiProperty({ type: Number, description: 'Days until expiry; negative when already expired.' })
  daysUntilExpiry: number | null;
}

export class CreateQualificationDto {
  @ApiProperty({ enum: QUALIFICATION_TYPES })
  @IsIn(QUALIFICATION_TYPES as unknown as string[])
  qualificationType: string;

  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() issuingBody?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() obtainedOn?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() expiresOn?: string;
}

export class SupervisionDto {
  @ApiProperty() id: string;
  @ApiProperty() registrarId: string;
  @ApiProperty() supervisorId: string;
  @ApiProperty() supervisorName: string;
  @ApiProperty({ enum: SUPERVISION_LEVELS }) supervisionLevel: string;
  @ApiPropertyOptional({ type: String, nullable: true, enum: TRAINING_TERMS }) trainingTerm: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) trainingOrganisation: string | null;
  @ApiProperty() effectiveFrom: string;
  @ApiPropertyOptional({ type: String, nullable: true }) effectiveTo: string | null;
  @ApiProperty({ description: 'Whether the level requires a supervisor rostered on site.' })
  requiresOnSiteSupervisor: boolean;
}

export class CreateSupervisionDto {
  @ApiProperty() @IsUUID() supervisorId: string;
  @ApiProperty({ enum: SUPERVISION_LEVELS })
  @IsIn(SUPERVISION_LEVELS as unknown as string[])
  supervisionLevel: string;
  @ApiPropertyOptional({ enum: TRAINING_TERMS })
  @IsOptional()
  @IsIn(TRAINING_TERMS as unknown as string[])
  trainingTerm?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() trainingOrganisation?: string;
  @ApiProperty() @IsDateString() effectiveFrom: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() effectiveTo?: string;
}

export class PractitionerDto {
  @ApiProperty() id: string;
  @ApiProperty() practiceId: string;
  @ApiPropertyOptional({ type: String, nullable: true }) title: string | null;
  @ApiProperty() givenName: string;
  @ApiProperty() familyName: string;
  @ApiProperty() displayName: string;
  @ApiPropertyOptional({ type: String, nullable: true }) preferredName: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) gender: string | null;
  @ApiProperty({ enum: PRACTITIONER_KINDS }) kind: string;
  @ApiProperty() kindLabel: string;
  @ApiPropertyOptional({ type: String, nullable: true }) email: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) mobile: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) ahpraRegistrationNumber: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) ahpraRegistrationType: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) ahpraExpiresOn: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) hpiI: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) prescriberNumber: string | null;
  @ApiProperty() vocationalRegistration: boolean;
  @ApiProperty({
    description: 'Gates MBS items 2715 and 2717.',
  })
  mentalHealthSkillsTraining: boolean;
  @ApiProperty() isSupervisor: boolean;
  @ApiProperty() isActive: boolean;
  @ApiProperty({ type: [ProviderNumberDto] }) providerNumbers: ProviderNumberDto[];
  @ApiPropertyOptional({ type: SupervisionDto, nullable: true })
  supervision: SupervisionDto | null;
  @ApiProperty({
    type: [String],
    description: 'Setup problems that need attention, e.g. a missing provider number.',
  })
  warnings: string[];
}
