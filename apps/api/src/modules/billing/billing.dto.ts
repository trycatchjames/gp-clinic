import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FEE_SCHEDULE_KINDS } from '@gp/contracts';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class FeeScheduleDto {
  @ApiProperty() id: string;
  @ApiProperty({ enum: FEE_SCHEDULE_KINDS }) kind: string;
  @ApiProperty() name: string;
  @ApiProperty({
    description: 'Bulk Bill and DVA are locked to their external schedules.',
  })
  isEditable: boolean;
  @ApiProperty() isDefault: boolean;
  @ApiProperty() effectiveFrom: string;
  @ApiProperty() itemCount: number;
}

export class FeeScheduleItemDto {
  @ApiProperty() id: string;
  @ApiProperty() itemCode: string;
  @ApiProperty() description: string;
  @ApiProperty({ description: 'What the practice charges, in cents.' }) feeCents: number;
  @ApiProperty({ description: 'The Medicare benefit, in cents.' }) benefitCents: number;
  @ApiProperty({
    description: 'What the patient actually pays — fee minus benefit, in cents.',
  })
  gapCents: number;
  @ApiPropertyOptional({ type: String, nullable: true }) mbsItemId: string | null;
  @ApiProperty() effectiveFrom: string;
}

export class UpdateFeeScheduleItemDto {
  @ApiProperty({ example: 9500, description: 'Practice fee in cents.' })
  @IsInt()
  @Min(0)
  feeCents: number;
}

export class MbsItemDto {
  @ApiProperty() id: string;
  @ApiProperty() itemNumber: string;
  @ApiProperty() description: string;
  @ApiProperty() category: string;
  @ApiProperty() group: string;
  @ApiProperty() scheduleFeeCents: number;
  @ApiProperty() benefitPercent: number;
  @ApiProperty() benefitCents: number;
  @ApiPropertyOptional({ type: Number, nullable: true }) minMinutes: number | null;
  @ApiPropertyOptional({ type: Number, nullable: true }) maxMinutes: number | null;
  @ApiProperty({
    description: 'MBS 2715/2717 require GPMHSC-accredited Mental Health Skills Training.',
  })
  requiresMentalHealthSkillsTraining: boolean;
  @ApiProperty() requiresMyMedicare: boolean;
  @ApiProperty() bulkBillIncentiveEligible: boolean;
  @ApiPropertyOptional({ type: Number, nullable: true }) frequencyLimitMonths: number | null;
  @ApiProperty() effectiveFrom: string;
  @ApiPropertyOptional({ type: String, nullable: true }) notes: string | null;
}

export class MbsItemQueryDto {
  @ApiPropertyOptional({ description: 'Search item number or description.' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter to one MBS group.' })
  @IsOptional()
  @IsString()
  group?: string;
}
