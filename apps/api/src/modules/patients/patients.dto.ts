import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PATIENT_MATCH_FIELDS, PATIENT_STATUSES } from '@gp/contracts';

export class PatientSearchResultDto {
  @ApiProperty() id: string;

  @ApiProperty({ description: 'Name used plus family name, e.g. "Isla Ngo".' })
  nameUsed: string;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    description: 'Legal given/family name, shown only when it differs from the name used.',
  })
  legalName: string | null;

  @ApiProperty() dateOfBirth: string;

  @ApiPropertyOptional({ type: String, nullable: true }) suburb: string | null;
  @ApiPropertyOptional({ type: String, nullable: true }) postcode: string | null;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    description: 'A contact number with all but the last three digits masked.',
  })
  maskedContact: string | null;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    description:
      'Medicare card number with all but the last two digits masked. Never labelled identity-verified.',
  })
  maskedMedicareNumber: string | null;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    description: 'Individual Reference Number — distinguishes family members on one card.',
  })
  medicareIrn: string | null;

  @ApiProperty() localRecordNumber: string;

  @ApiProperty({ enum: PATIENT_STATUSES }) status: string;

  @ApiProperty({
    description: 'True when another result shares this family name and date of birth.',
  })
  similarMatch: boolean;

  @ApiProperty({
    type: [String],
    enum: PATIENT_MATCH_FIELDS,
    description: 'Which safe fields matched the search, in plain language.',
  })
  matchedFields: string[];

  @ApiProperty({
    description:
      'True when this record carries an active access restriction the caller may not open. ' +
      'A restricted result is an identity stub: it exists so a duplicate is not created, and ' +
      'every field beyond name, date of birth, record number, status and matched fields is null.',
  })
  restricted: boolean;
}

export class PatientSearchResponseDto {
  @ApiProperty({ type: [PatientSearchResultDto] }) results: PatientSearchResultDto[];
  @ApiProperty({ description: 'Total candidates matched, before the result cap.' })
  totalMatches: number;
  @ApiProperty({ description: 'True when totalMatches exceeds the returned results.' })
  truncated: boolean;
  @ApiProperty({
    description:
      'How many of the returned results are restricted stubs, so the screen can name the ' +
      'restriction once rather than repeating it on every row.',
  })
  restrictedMatches: number;
}
